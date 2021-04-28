import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {

  uploadedFiles: any[] = [];
  fileOver: boolean = false;
  hasBaseDropZoneOver: any;
  messageCaption: string = '';

  constructor(
    public media: MediaService,
    private messageService: MessageService,
  ) { }

  showError(title: string, message: string) {
    this.messageService.clear()
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 5000 });
  }

  fileSelected() {
    console.log('file selected')
    let size = this.media.uploader.queue[0]._file.size / 1024 / 1024
    console.log('size is: ', size, 'MB');
    if (size > 5) {
      this.showError('Size limit exceeded', 'The image must be less than 5 MB');
      this.media.uploader.clearQueue();
    }
    // this.getFileUrl(this.uploader.queue[0])
  }

  isFile: boolean;
  imgUrl: ArrayBuffer | string = '';
  gettingUrl: boolean = false;
  getFileUrl(event: any) {
    console.log(event);    
    if (!this.gettingUrl) {
      if (event.type.split('/')[0] === 'image') {
        this.isFile = false;
        this.imgUrl = '';
        this.gettingUrl = true;
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
          this.imgUrl = reader.result
        }
      }
      else {
        this.isFile = true;
        this.imgUrl = '';
        this.gettingUrl = true;
      }
    }
  }
 
  getFileSize(bytes: number): string {
    let mb = bytes / 1024 / 1024
    console.log(mb) 
    if(mb < 1) {
      return String(Number(mb * 1024).toFixed(2)) + ' KB'
    }
    return String(Number(mb).toFixed(2)) + ' MB'
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  resetUpload(flag: boolean = false) {
    this.imgUrl = '';
    this.isFile = false;
    this.gettingUrl = false;
    this.messageCaption = flag ? this.messageCaption :'';
    this.media.uploader.clearQueue();
  }

  ngOnInit() {
    this.media.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.media.uploader.onCompleteItem = (item: any, status: any) => {
      // console.log('Uploaded File Details:', item, status);
      let res: any;
      try {
        res = JSON.parse(status);
        let details = {
          url: res.url,
          pid: res.fileId,
          caption: this.messageCaption,
          thumb: res.thumbnailUrl
        }
        this.media.uploadedFile(details);
        this.resetUpload();
      } catch (e) {
        console.log(status, 'Error Uploading');
      }
    };
    this.media.cancelUpload.subscribe((val: Boolean) => {
      if (val === true) {
        this.media.uploader.cancelAll();
        this.resetUpload();
        this.media.uploadedFile(false);
      }
    })
  }
}
