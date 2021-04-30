import { Pipe, PipeTransform } from '@angular/core';
import { MessagesService } from './services/messages.service';

@Pipe({
  name: 'mstatus'
})
export class MstatusPipe implements PipeTransform {

  constructor(
    private message: MessagesService
  ) {
  }

  transform(value: string, mid: string, seen: boolean, delay: number): unknown {
    this.message.messageIsRead(mid);
    if (!seen) {
      console.log('checking',  mid)
      setTimeout(() => {
        this.message.updateMessageSeenStatus(mid);
      }, Number(delay) * 1000);
    }
    return value;
  }

}
