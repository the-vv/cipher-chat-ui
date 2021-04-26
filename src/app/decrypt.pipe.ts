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

  transform(value: any, encrypt: boolean = false, mode: boolean = false): string {
    if (encrypt && value.length) {
      if(mode) {
        return AES.encrypt(value, this.userService.publicCryptoKey).toString();
      }
      return this.encrypt(value, 6)
    }
    return value;
  }

  getMap(legend: any[], shift: number) {
    return legend.reduce((charsMap, currentChar, charIndex) => {
      const copy = { ...charsMap };
      let ind = (charIndex + shift) % legend.length;
      if (ind < 0) {
        ind += legend.length;
      };
      copy[currentChar] = legend[ind];
      return copy;
    }, {});
  };
  encrypt(str: string, shift = 0) {
    const legend = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const map = this.getMap(legend, shift);
    return str
      .toLowerCase()
      .split('')
      .map((char: any) => map[char] || char)
      .join('');
  }

}
