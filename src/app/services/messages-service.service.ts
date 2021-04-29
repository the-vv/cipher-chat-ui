import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { RestApiService } from './restApis.service';
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
  askUpload: boolean = false;
  showComposer: boolean = true;
  composerContent: string = '';

  constructor(
    public socket: SocketService,
    private rest: RestApiService
  ) {
    this.socket.messages
      .subscribe(messages => {        // recieving new messages and saving it to messages array
        this.newMessages = messages;
        this.isMessageReaady = true;
        if (messages.from._id != messages.to._id) {
          this.pushChat(messages);
        }
      })
    this.socket.messageReadStatus
      .subscribe(mess => {
        // console.log(mess)
        this.updateMessageReadStatus(mess); 
      })
  }

  composerData(event: any) {
    console.log(event.html)
  }

  getMessages() {   
    this.socket.getMessages()
      .then(mess => {
        this.newMessages = mess;
        this.isMessageReaady = true;
        this.addChatLists();
        // console.log(this.chatList)
      })
      .catch(e => {  
        console.error('Failed to get messages\n', e);
      })
  }

  sendMediaMessage(to: any, mediaData: any) {
    let message: Message = {
      message: mediaData.caption,
      from: this.socket.User._id,
      to: to,
      datetime: new Date(),
      seen: false,
      read: false,
      hasMedia: true,
      media: {
        mediaType: mediaData.type,
        pid: mediaData.pid,
        url: mediaData.url,
        thumb: mediaData.thumb ? mediaData.thumb : null,
        name: mediaData.name,
        size: mediaData.size
      }
    }
    console.log(message)
    this.socket.saveMessage(message)
      .then((mess: any) => {
        console.log(mess.res);
        this.pushChat(mess.res)
      })
      .catch(err => {
        console.log(err);
      });
  }

  sendMessage(to: any, mess: string) {
    let message: Message = {
      message: mess,
      from: this.socket.User._id,
      to: to,
      datetime: new Date(),
      seen: false,
      read: false,
      hasMedia: false
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
      message: 'Added for chat 🎉',
      from: this.socket.User._id,
      to: user._id,
      datetime: new Date(),
      seen: false,
      read: false,
      hasMedia: false
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
          email: otherEndUser.email,
          color: otherEndUser.settings.color
        }
        this.chatList.push(clist)
      }
    })
    this.sortChatList();
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
        email: otherEndUser.email,
        color: otherEndUser.settings.color
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
    let pidsToDelete = c.messages
      .filter((val: any) => val.hasMedia)
      .map((val: any) => val.media.pid);
    console.log(pidsToDelete)
    Promise.all([this.socket.deleteMessages(idsToDelete), this.rest.deleteIMages(pidsToDelete).toPromise()])
      .then((values: any[]) => {
        console.log(values)
        this.chatList = this.chatList.filter(val => {
          return val._id != c._id;
        })
      })
      .catch((err: any) => {
        console.log('Chat delete error\n', err)
      })
    // this.socket.deleteMessages(idsToDelete)
    //   .then((_) => {
    //     this.chatList = this.chatList.filter(val => {
    //       return val._id != c._id;
    //     })
    //   })
    //   .catch(err => {
    //     console.log('Deletion Errorn\n', err);
    //   })
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

  updateMessageSeenStatus(id: string) {
    this.socket.updateMessageStatus(id)
      .then((_) => {
        this.chatList.forEach(el => {
          el.messages.forEach((element: any) => {
            if (element._id == id) {
              element.seen = true;
              // console.log(element);
            }
          });
        })
      })
      .catch(_ => {
        console.log('error updaitng message seen')
      })
  }

  messageIsRead(mid: string) {
    this.chatList.forEach(el => {
      el.messages.forEach((element: any) => {
        // console.log('checking', element._id, mid)
        if (element._id == mid && element.read === false && this.socket.User._id == element.to._id) {
          // console.log('read', element.message)         
          this.socket.updateMessageRead(element._id)
            .then((res: any) => {
              // console.log(res.mess);
              this.updateMessageReadStatus(res.mess)
            })
        }
      });
    })
  }

  updateMessageReadStatus(mess: any) {
    // console.log(mess)
    this.chatList.forEach(el => {
      el.messages.forEach((element: any) => {
        // console.log(element) 
        if (element._id == mess._id) {
          element.read = mess.read;
          // console.log(element)
        }
      });
    })
  }

}
