import { Component, OnInit, Input, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {

  hasBaseDropZoneOver: boolean = false;
  uploader: FileUploader;
  response: string;

  constructor(
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient,
    private socket: SocketService
  ) {
    // this.responses = [];
  }

  ngOnInit(): void {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/cipherchat/image/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = async (fileItem: any, form: FormData) => {
      // Add Cloudinary unsigned upload preset to the upload form
      form.append('upload_preset', 'cipherChatImages');

      // Add file to upload
      form.append('file', fileItem);
      form.append("api_key", "333784116198625");
      // let res = await this.socket.getSignature();
      // console.log(res)
      // form.append("timestamp", res.timestamp);
      // form.append("signature", res.signature);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    }

    this.uploader.response.subscribe((res: any) => {
      console.log(JSON.parse(res))
      this.response = res
    });

  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
