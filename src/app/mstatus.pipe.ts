import { Pipe, PipeTransform } from '@angular/core';
import { MessagesServiceService } from './services/messages-service.service';
import { UserServiceService } from './services/user-service.service';

@Pipe({
  name: 'mstatus'
})
export class MstatusPipe implements PipeTransform {

  constructor(
    private message: MessagesServiceService,
    private User: UserServiceService
    ) {
  }

  transform(value: unknown, mid: string, seen: boolean, delay: number): unknown {
    console.log(this.User.userDetails.settings.encryptDelay)
    if(!seen) {
      setTimeout(() => {
        this.message.updateMessageSeenStatus(mid);
      }, Number(delay) * 1000);
    }
    return value;
  }
 
}
