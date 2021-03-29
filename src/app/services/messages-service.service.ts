import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceService {

  newMessages: any[];
  isMessageReaady: boolean = false;

  constructor(
    private socket: SocketService
  ) {
    this.socket.messages
      .subscribe(messages => {
        this.newMessages = messages;
        this.isMessageReaady = true;
      })
  }

}
