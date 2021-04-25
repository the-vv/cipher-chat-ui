import { Injectable } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  uploader: FileUploader;
  response: string;

  constructor() { }
}
