import {
  AfterViewChecked, ElementRef, ViewChild, Component,
  Input, OnChanges, OnInit, SimpleChanges, HostListener,
  AfterViewInit, Output, EventEmitter
} from '@angular/core';
import { MessagesServiceService } from '../services/messages-service.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chats-screen',
  templateUrl: './chats-screen.component.html',
  styleUrls: ['./chats-screen.component.scss']
})
export class ChatsScreenComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {

  @Output()
  onBack: EventEmitter<any> = new EventEmitter<any>();

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.mobileView = event.target.innerWidth < 768 ? true : false;
  }

  handleScroll() {
    this.needScroll = this.isUserNearBottom() ? true : false;
    this.needScroll2 = false;
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.offsetHeight;
    const height = this.scrollContainer.nativeElement.scrollHeight;
    return position > height - threshold;
  }

  onFocus() {
    this.isChatSendable = true;
  }

  onBlur() {
    this.isChatSendable = false;
  }

  goToBottom() {
    this.needScroll = true;
    this.scrollToBottom();
  }

  messages: any[];
  currentUserId: string;
  randomColor: string;
  messageString: string;
  isChatSendable: boolean = false;
  container: HTMLElement;
  needScroll: boolean = true;
  needScroll2: boolean = true;
  canScrollSmooth: boolean = false;
  public mobileView: boolean = false;

  constructor(public socket: SocketService,
    private message: MessagesServiceService) {
  }

  ngOnInit() {
    this.scrollToBottom();
    this.mobileView = window.innerWidth < 768 ? true : false;
  }

  ngAfterViewChecked() {
    if (this.needScroll && this.needScroll2) {
      this.scrollToBottom();
    }
  }

  goBack() {
    this.onBack.emit();
  }

  ngAfterViewInit() {
  }

  scrollToBottom(): void {
    try {
      if (this.needScroll) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  sendMessage() {
    if (this.messageString.length <= 0) {
      return;
    }
    this.message.sendMessage(this.chat._id, this.messageString);
    this.messageString = '';
    this.needScroll2 = true;
    // this.message.addNewChatTo(); 
  }

  setRandColor() {
    return { 'backgroundColor': this.randomColor }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.messageString = '';
    this.canScrollSmooth = false;
    this.needScroll = true;
    if (changes.chat.currentValue != undefined) {
      this.currentUserId = this.socket.User._id;
      this.randomColor = changes.chat.currentValue.color;
      this.messages = changes.chat.currentValue.messages;
      this.needScroll2 = true;
      if (!this.canScrollSmooth) {
        setTimeout(() => {
          this.canScrollSmooth = true;
        }, 200);
      }
      // console.log(changes.chat.currentValue);
    }
  }

}
