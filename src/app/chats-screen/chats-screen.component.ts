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
  scrollContainer: ElementRef;

  @HostListener('document:keyup', ['$event'])
  handleInput(event: KeyboardEvent) {
    if (event.code == 'Enter' && this.isChatSendable && this.messageString.length > 0) {
      this.sendMessage();
    }
  }


  handleScroll(event) {
    console.log(event, 'hllo');
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
  needScroll: boolean = true;

  constructor(public socket: SocketService,
    private message: MessagesServiceService) {
  }


  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (this.needScroll) {
      this.scrollToBottom();
    }
  }

  ngAfterViewInit() {
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage() {
    if (this.messageString.length <= 0) {
      return;
    }
    this.needScroll = true;
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

      this.needScroll = true;
    }
  }

}
