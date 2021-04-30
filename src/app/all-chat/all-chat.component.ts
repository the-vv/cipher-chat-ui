import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../services/messages.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-all-chat',
  templateUrl: './all-chat.component.html',
  styleUrls: ['./all-chat.component.scss'],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-70%)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-70%)' })),
      ]),
    ])
  ]
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
  mobileView: boolean = false;
  searchtext: string = '';

  constructor(
    public socket: SocketService,
    public message: MessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.mobileView = window.innerWidth < 768 ? true : false;
  }

  ngOnInit(): void {
    this.message.getMessages();
    this.route.queryParams
      .subscribe(params => {
        if (params.vmode != 1) {
          this.selectedChat = null
        };
      });
  }

  checkMail() {
    this.disableNewChat = true;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(this.mailId))) {
      if (this.message.checkIfAlreadyChatting(this.mailId)) {
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
            this.newChatUser = res.user;
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
    if (this.newChatUser) {
      this.message.addNewChatTo(this.newChatUser);
    } else {
      console.log('newChat Error');
    }
    this.mailId = ''
    this.newChatUser = null
    this.newChatError = null
  }

  chatSelected(chat: any) {
    // console.log(chat);    
    this.selectedChat = chat;
    this.router.navigate(['/chats'], { queryParams: { vmode: 1 } })
  }

  onBack() {
    this.selectedChat = null;
    this.router.navigate(['/chats'], { queryParams: {}, replaceUrl: true })
  }

  onRightClick(chat: any) {
    console.log(chat)
  }

  deleteChat(chat: any) {
    if (chat._id == this.selectedChat?._id) {
      this.selectedChat = null;
    }
    this.message.deleteChat(chat)
  }

  rClicked(e: any) {
    console.log(e)
  }

  onSearch() {
    this.searchtext = this.searchtext.trim();
    this.searchtext.length && this.message.searchList(this.searchtext)
  }

}
