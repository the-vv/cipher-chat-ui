import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  imgUploaded: Subject<any> = new Subject();
  cancelUpload: Subject<boolean> = new Subject();
  askUpload: boolean = false;

  constructor() { }

  uploadedFile(details: any) {
    this.askUpload = false;
    this.imgUploaded.next(details);
  }

}
