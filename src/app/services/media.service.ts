import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  imgUploaded: Subject<any> = new Subject();
  cancelUpload: Subject<boolean> = new Subject();

  constructor() { }

  uploadedFile(details: any) {
    console.log(details)
    this.imgUploaded.next(details)

  }

}
