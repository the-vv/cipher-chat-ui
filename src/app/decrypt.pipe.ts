import { Pipe, PipeTransform } from '@angular/core';
import { AES } from 'crypto-js';
import { UserServiceService } from './services/user-service.service';

@Pipe({
  name: 'decrypt'
})
export class DecryptPipe implements PipeTransform {

  constructor(
    public userService: UserServiceService
  ) {
  }

  transform(value: any, encrypt: boolean = false): string {
    if (encrypt) {
      return AES.encrypt(value, this.userService.publicCryptoKey).toString();
    }
    return value;
  }

}
 