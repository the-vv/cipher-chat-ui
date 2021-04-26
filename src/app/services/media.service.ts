import { Injectable } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  imgUploaded: Subject<any> = new Subject();
  cancelUpload: Subject<boolean> = new Subject();
  askUpload: boolean = false;

  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:3000/upload',
    itemAlias: 'file',
    isHTML5: true
  });

  constructor() { }

  uploadedFile(details: any) {
    this.askUpload = false;
    this.imgUploaded.next(details);
  }

}
