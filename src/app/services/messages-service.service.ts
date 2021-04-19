import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceService {

  newMessages: any;
  isMessageReaady: boolean = false;
  chatList: any[] = [];
  searchedList: any[] = [];
  isListening: boolean = false;

  constructor(
    public socket: SocketService
  ) {
    this.socket.messages
      .subscribe(messages => {        // recieving new messages and saving it to messages array
        this.newMessages = messages;
        this.isMessageReaady = true;
        if (messages.from._id != messages.to._id) {
          this.pushChat(messages);
        }
      })
  }

  getMessages() {
    this.socket.getMessages()
      .then(mess => {
        this.newMessages = mess;
        this.isMessageReaady = true;
        this.addChatLists();
      })
      .catch(e => {
        console.error('Failed to get messages\n', e);        
      })
  }

  sendMessage(to: any, mess: string) {
    let message: Message = {
      message: mess,
      from: this.socket.User._id,
      to: to,
      datetime: new Date()
    }
    this.socket.saveMessage(message)
      .then((mess: any) => {
        this.pushChat(mess.res)
      })
      .catch(err => {
        console.log(err);
      });
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
        // console.log(mess.res);
        this.pushChat(mess.res)
      })
      .catch(err => {
        console.log(err);
      });
  }

  addChatLists() {
    this.newMessages.forEach((mess: any) => {
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
          name: otherEndUser.name,
          email: otherEndUser.email
        }
        this.chatList.push(clist)
      }
    })
    this.sortChatList();
    // console.log(this.chatList);
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
        name: otherEndUser.name,
        email: otherEndUser.email
      }
      this.chatList.splice(0, 0, clist);
    }
    this.sortChatList();
  }

  checkIfAlreadyChatting(email: string): boolean {
    let chating = false;
    this.chatList.forEach(chat => {
      if (chat.email == email) {
        chating = true;
      }
    })
    return chating;
  }

  deleteChat(c: any) {
    let idsToDelete = c.messages.map((mes: any) => mes._id);
    this.socket.deleteMessages(idsToDelete)
      .then((_) => {
        this.chatList = this.chatList.filter(val => {
          return val._id != c._id;
        })
      })
      .catch(err => {
        console.log('Deletion Errorn\n', err);
      })
  }

  sortChatList() {
    this.chatList.sort((a, b) => {
      let adate = new Date(a.messages[a.messages.length - 1].datetime)
      let bdate = new Date(b.messages[b.messages.length - 1].datetime)
      return +bdate - +adate
    })
  }

  searchList(query: string) {
    this.searchedList = []
    this.searchedList = this.chatList.filter((val) => {
      let result = false;
      query = query.toLowerCase();
      let tempemail = val.email.toLowerCase();
      let tempname = val.name.toLowerCase();
      if (tempemail.indexOf(query) >= 0 || tempname.indexOf(query) >= 0) {
        result = true;
      }
      val.messages.forEach((el: any) => {
        let tempmess = el.message.toLowerCase()
        if (tempmess.indexOf(query) >= 0) {
          result = true
        }
      });
      return result;
    })
  }

}
