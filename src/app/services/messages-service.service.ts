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
    public socket: SocketService
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
      message: 'Added for chat',
      from: this.socket.User._id,
      to: user._id,
      datetime: new Date()
    }
    this.socket.saveMessage(message)
      .then((mess: any) => {
        console.log(mess.res);
        this.pushChat(mess.res)
      })
      .catch(err => {
        console.log(err);
      });
  }

  addChatLists() {
    this.newMessages.forEach(mess => {
      let otherEndUser: any;
      let clist: any;
      if (mess.from._id == this.socket.User._id) {
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

  pushChat(mess: any) {
    let otherEndUser: any;
    let clist: any;
    if (mess.from._id == this.socket.User._id) {
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
  }

}
