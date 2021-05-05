import { Injectable } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  imgUploaded: Subject<any> = new Subject();
  cancelUpload: Subject<boolean> = new Subject();
  askUpload: boolean = false;

  private url = environment.production ? '/api/upload' : 'http://localhost:3000/api/upload';

  public uploader: FileUploader = new FileUploader({
    url: this.url,
    itemAlias: 'file',
    isHTML5: true
  });

  constructor() { }

  uploadedFile(details: any) {
    this.askUpload = false;
    this.imgUploaded.next(details);
  }

}
