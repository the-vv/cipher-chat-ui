import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {

  uploadedFiles: any[] = [];

  constructor() { }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    // let resp = event.originalEvent.body as 
    console.log('uploaded', event.originalEvent.body);
  }



  imgUrl: any = ''
  getFileUrl(event: any) {
    console.log(event);
    
    const reader = new FileReader();
    reader.readAsDataURL(event.files[0]);
    reader.onload = () => {
      this.imgUrl = reader.result
    }
  }

  ngOnInit() {

  }

  // hasBaseDropZoneOver: boolean = false;
  // uploader: FileUploader;
  // response: string;
  // 
  // constructor(
  // public media: MediaService
  // ) {
  // }
  //  
  // ngOnInit(): void {
  // Create the file uploader, wire it to upload to your account
  // const uploaderOptions: FileUploaderOptions = {
  // url: `http://localhost:3000/upload`,
  // Upload files automatically upon addition to upload queue
  // autoUpload: true,
  // Use xhrTransport in favor of iframeTransport
  // isHTML5: true,
  // Calculate progress independently for each uploaded file
  // removeAfterUpload: true,
  // XHR request headers
  // headers: [
  // {
  // name: 'X-Requested-With',
  // value: 'XMLHttpRequest'
  // }
  // ]
  // };
  // 
  // this.uploader = new FileUploader(uploaderOptions);
  // 
  // this.uploader.onBuildItemForm = async (fileItem: any, form: FormData) => {
  // Add file to upload
  // form.append('file', fileItem);
  // Use default "withCredentials" value for CORS requests
  // fileItem.withCredentials = false;
  // return { fileItem, form };
  // }
  // 
  // this.uploader.response.subscribe((res: any) => {
  // this.response = res
  // let jres;
  // try {
  // console.log(JSON.parse(res));
  // jres = JSON.parse(res)
  // }
  // catch {        
  // console.log(res);
  // }
  // finally {
  // if( jres?.filename) {
  // console.log('deleting', jres.filename.split('/')[1]);
  // 
  // }
  // }
  // });
  // 
  // }
  // 
  // fileOverBase(e: any): void {
  // this.hasBaseDropZoneOver = e;
  // }
}
