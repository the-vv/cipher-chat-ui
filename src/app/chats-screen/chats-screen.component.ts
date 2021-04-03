import { AfterViewChecked, ElementRef, ViewChild, Component, Input, OnChanges, OnInit, SimpleChanges, HostListener, AfterViewInit } from '@angular/core';
import { MessagesServiceService } from '../services/messages-service.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chats-screen',
  templateUrl: './chats-screen.component.html',
  styleUrls: ['./chats-screen.component.scss']
})
export class ChatsScreenComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {

  @Input()
  chat: any;

  @Input()
  hasSelected: boolean = false;

  @ViewChild('scrollDown')
  myScrollContainer: ElementRef;

  @HostListener('document:keyup', ['$event'])
  handleInput(event: KeyboardEvent) {
    if(event.code == 'Enter' && this.isChatSendable && this.messageString.length > 0) {
      this.sendMessage();
    }    
  }

  @HostListener('scroll', ['$event'])
  handleScroll($event) {
    console.log($event, 'hllo');    
  }

  onFocus() {
    this.isChatSendable = true;
  }

  onBlur() {
    this.isChatSendable = false;
  }

  messages: any[];
  currentUserId: string;
  randomColor: string;
  messageString: string;
  isChatSendable: boolean = false;
  container: HTMLElement;
  needChange: boolean = true;

  constructor(public socket: SocketService,
    private message: MessagesServiceService) {
  }

 
  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    if(this.needChange) {
      this.scrollToBottom();
      this.needChange = false;
    }
  }

  ngAfterViewInit() {    
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage() {
    if(this.messageString.length <=0 ) {
      return;
    }  
    this.needChange = true;
    this.message.sendMessage(this.chat._id, this.messageString);
    this.messageString = '';  
    // this.message.addNewChatTo(); 
  }

  setRandColor() {
    return { 'backgroundColor': this.randomColor }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.messageString = '';
    if (changes.chat.currentValue != undefined) {
      this.currentUserId = this.socket.User._id;
      this.randomColor = changes.chat.currentValue.color;
      this.messages = changes.chat.currentValue.messages;
      console.log(changes.chat.currentValue);
      
      this.needChange = true;
    }
  }

}
