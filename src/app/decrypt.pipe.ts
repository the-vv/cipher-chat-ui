import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decrypt'
})
export class DecryptPipe implements PipeTransform {

  transform(value: any, flas: boolean = false): unknown {
    return value;
  }

}
