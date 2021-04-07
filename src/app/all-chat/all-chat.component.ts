import { Component, HostListener, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { MessagesServiceService } from '../services/messages-service.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-all-chat',
  templateUrl: './all-chat.component.html',
  styleUrls: ['./all-chat.component.scss']
})
export class AllChatComponent implements OnInit {

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.mobileView = event.target.innerWidth < 768 ? true : false;
  }

  askNew: boolean = false;
  mailId: string = '';
  emailCheckSpinner: boolean = false;
  disableNewChat: boolean = true;
  newChatError: string = '';
  newChatButtonIcon: string = 'pi-comments';
  newChatUser: any;
  selectedChat: any;
  public mobileView: boolean = false;

  constructor(
    public socket: SocketService,
    public message: MessagesServiceService
  ) {    
    this.mobileView = window.innerWidth < 768 ? true : false;
   }

  ngOnInit(): void {
    this.message.getMessages()
  }

  checkMail() {
    this.disableNewChat = true;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(this.mailId))) {
      if(this.message.checkIfAlreadyChatting(this.mailId)) {
        this.newChatError = 'You are already chatting with this user';
        return;
      }
      this.newChatError = 'Checking...'
      this.newChatButtonIcon = 'pi-spin pi-spinner';
      this.socket.checkMailExist(this.mailId)
        .then((res: any) => {
          this.newChatButtonIcon = 'pi-comments';
          if (res.success) {
            this.disableNewChat = false;
            this.newChatError = 'User available to chat... Yay!';
            this.newChatUser = res.user
          } else {
            this.disableNewChat = true;
            this.newChatError = 'This user does not have an account on Cipher Chat';
          }
        })
        .catch(res => {
          this.newChatButtonIcon = 'pi-comments';
          this.newChatError = res.status;
        })
    }
    else {
      this.newChatError = 'Invalid Email Id';
    }
  }

  startNewChat() {
    this.askNew = !this.askNew;
    if(this.newChatUser) {
      this.message.addNewChatTo(this.newChatUser);
    } else {
      console.log('newChat Error');      
    }
  }

  chatSelected(chat: any) {
    // console.log(chat);    
    this.selectedChat = chat;
  }

  onBack() {
    this.selectedChat = null;
    
  }

}
