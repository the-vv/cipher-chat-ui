import { Injectable } from '@angular/core';
import { LoginPageComponent } from '../login-page/login-page.component';
import { Message } from '../models/message';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceService {

  newMessages: any[];
  isMessageReaady: boolean = false;
  chatList: any[] = [];

  constructor(
    private socket: SocketService
  ) {
    this.socket.messages
      .subscribe(messages => {
        this.newMessages = messages;
        this.isMessageReaady = true;
        this.addChatLists();
        // console.log(this.newMessages);        
      })
  }

  addNewChatTo(user: any) {
    let message: Message = {
      message: this.socket.User.name + ' Started to chat with You',
      from: this.socket.User._id,
      to: user._id,
      datetime: new Date()
    }
    this.chatList.push(
      {
        user: user,
        messages: [message]
      }
    )
    this.socket.saveMessage(message);
  }

  addChatLists() {
    let currUserId = this.socket.User._id;
    this.newMessages.forEach(mess => {
      let otherEndUser: any;
      let clist: any;
      if (mess.from._id == currUserId) {
        otherEndUser = mess.to;
      } else {
        otherEndUser = mess.from;
      }
      let chatAlreadyExsts = -1;
      let i = 0
      for (i = 0; i < this.chatList.length; i++) {
        if (this.chatList[i]._id == otherEndUser._id) {
          chatAlreadyExsts = i;
          break;
        }
      }
      if (chatAlreadyExsts >= 0) {
        this.chatList[i].messages.push(mess);
      }
      else {
        clist = {
          messages: [mess],
          _id: otherEndUser._id,
          name: otherEndUser.name
        }
        this.chatList.push(clist)
      }
    })
    console.log(this.chatList);
  }

}
