import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Message } from '../models/message';
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
  fileSize: String;
  fileFormat: string;
  fileName: string

  constructor(
    public media: MediaService,
    private messageService: MessageService,
  ) { }

  showError(title: string, message: string) {
    this.messageService.clear()
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 5000 });
  }

  setFileInfo() {
    this.fileFormat = this.media.uploader.queue[0]._file.name.split('.')[this.media.uploader.queue[0]._file.name.split('.').length - 1];
    this.fileName = this.media.uploader.queue[0]._file.name;
    this.fileSize = this.getFileSize(this.media.uploader.queue[0]._file.size);
    console.log(this.fileFormat, this.fileSize, this.fileName);
    
  }

  fileDropped(event: any) {
    this.setFileInfo();
    // console.log(event);
    let size = event[0].size / 1024 / 1024
    console.log('size is: ', size, 'MB');
    if (size > 5) {
      this.showError('Size limit exceeded', 'The file must be less than 5 MB');
      this.media.uploader.clearQueue();
    }
  }

  fileSelected() {
    this.setFileInfo();
    // console.log(this.media.uploader.queue[0]._file)
    let size = this.media.uploader.queue[0]._file.size / 1024 / 1024
    console.log('size is: ', size, 'MB');
    if (size > 5) {
      this.showError('Size limit exceeded', 'The file must be less than 5 MB');
      this.media.uploader.clearQueue();
    }
    // this.getFileUrl(this.uploader.queue[0])
  }

  isFile: boolean;
  imgUrl: ArrayBuffer | string = '';
  gettingUrl: boolean = false;
  getFileUrl(event: any) {
    // console.log(event);    
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
    let mb = bytes / 1024 / 1024;
    if (mb < 1) {
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
    this.messageCaption = flag ? this.messageCaption : '';
    this.media.uploader.clearQueue();
    this.fileFormat = '';
    this.fileName = '';
    this.fileSize = ''
  }

  ngOnInit() {
    this.media.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = true;
    };
    this.media.uploader.onCompleteItem = (item: any, status: any) => {
      // console.log('Uploaded File Details:', item, status);
      let res: any;
      try {
        res = JSON.parse(status);
        // console.log(res)
        let details = {
          url: res.url,
          pid: res.fileId,
          caption: this.messageCaption,
          type: res.fileType,
          name: this.fileName,
          size: this.fileSize
        }
        // console.log(details)
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
