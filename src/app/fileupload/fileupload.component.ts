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
    let size = this.media.uploader.queue[0]._file.size/1024/1024
    console.log('size is: ', size, 'MB');
    if(size > 5) {
      this.showError('Size limit exceeded', 'The image must be less than 5 MB');
      this.media.uploader.clearQueue();
    }
    // this.getFileUrl(this.uploader.queue[0])
  }

  imgUrl: any = '';
  gettingUrl: boolean = false;
  getFileUrl(event: any) {
    if (!this.gettingUrl) {
      this.imgUrl = '';
      this.gettingUrl = true;
      // console.log('getting url');
      this.imgUrl = ''
      const reader = new FileReader();
      reader.readAsDataURL(event);
      reader.onload = () => {
        this.imgUrl = reader.result
      }
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  resetUpload() {
    this.imgUrl = '';
    this.gettingUrl = false;
    this.messageCaption = '';
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
          url: res.path,
          pid: res.filename.split('/')[1],
          caption: this.messageCaption
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
