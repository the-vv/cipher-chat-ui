import {
  AfterViewChecked, ElementRef, ViewChild, Component,
  Input, OnChanges, OnInit, SimpleChanges, HostListener,
  AfterViewInit, Output, EventEmitter
} from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message';
import { MediaService } from '../services/media.service';
import { MessagesServiceService } from '../services/messages-service.service';
import { SocketService } from '../services/socket.service';
import { UserServiceService } from '../services/user-service.service';

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

  @ViewChild('autoFocus')
  chatInputElament: ElementRef;

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
    this.showbutton = !this.needScroll && this.isScrollingToBottom();
    this.needScroll2 = false;
    this.isScrollingToBottom()
  }

  isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.offsetHeight;
    const height = this.scrollContainer.nativeElement.scrollHeight;
    return position > height - threshold;
  }

  scroll: any;
  currentPosition: any
  isScrollingToBottom(): boolean {
    this.scroll = this.scrollContainer.nativeElement.scrollTop;
    let show: boolean;
    if (this.scroll > this.currentPosition) {
      show = true;
    }
    else {
      show = false;
    }
    this.currentPosition = this.scroll;
    return show;
  }

  onFocus() {
    this.isChatSendable = true;
    this.toggleEmoji = false
  }

  onBlur() {
    this.isChatSendable = false;
    this.toggleEmoji = false
  }

  goToBottom() {
    this.needScroll = true;
    this.scrollToBottom();
  }

  messages: Message[];
  currentUserId: string;
  randomColor: string;
  messageString: string;
  isChatSendable: boolean = false;
  container: HTMLElement;
  needScroll: boolean = true;
  needScroll2: boolean = true;
  canScrollSmooth: boolean = false;
  mobileView: boolean = false;
  prevChatListLength: number;
  prevChatListLength2: number;
  showbutton: boolean;
  chatImages: any[] = [];
  imgShow = false;
  imagesArray: any[] = [];
  atatchmenticon: string = 'bi bi-paperclip';
  downloadingUrl: string = '';
  openFab: BehaviorSubject<boolean> = new BehaviorSubject(true);
  sendingMessage: boolean = false;

  constructor(public socket: SocketService,
    public message: MessagesServiceService,
    public userService: UserServiceService,
    public media: MediaService,
    public gallery: Gallery,
    public lightbox: Lightbox
  ) {
  }

  ngOnInit() {
    this.scrollToBottom();
    this.mobileView = window.innerWidth < 768 ? true : false;
    const lightboxRef = this.gallery.ref('lightbox');
    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom
    });
    this.gallery.ref('lightbox').setConfig({
      // dots: true,
      // zoomOut: -1 
    });
  }

  findImageIndex(url: string): number {
    for (let i = 0; i < this.chatImages.length; i++) {
      if (this.items[i].data.src === url) {
        return i;
      }
    }
  }

  items: GalleryItem[];
  ngAfterViewChecked() {
    let lightboxRef = this.gallery.ref('lightbox')
    if (this.messages?.length != this.prevChatListLength2) {
      let images = new Set();
      this.messages.forEach(el => {
        if (el.hasMedia && el.media.mediaType === 'image') {
          images.add({ image: el.media.url, caption: el.message, pid: el.media.pid })
        }
      })
      this.chatImages = [...images];
      this.items = this.chatImages.map(item =>
        new ImageItem({ src: item.image, thumb: item.image })
      );
      lightboxRef.load(this.items);
      this.gallery.ref('lightbox').load(this.items);
      this.prevChatListLength2 = this.messages?.length
    }
    if (this.needScroll && (this.needScroll2 || this.messages?.length != this.prevChatListLength)) {
      this.prevChatListLength = this.messages?.length
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
    this.sendingMessage = true;
    this.message.sendMessage(this.chat._id, this.messageString)
    .then(() => {
      this.sendingMessage = false;
    })
    .catch(() => {
      this.sendingMessage = false;
    });;
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
      console.log(this.messages);

      if (!this.canScrollSmooth) {
        setTimeout(() => {
          this.chatInputElament && this.chatInputElament.nativeElement.focus();
          this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
          this.canScrollSmooth = true;
        }, 500);
      }
      // console.log(changes.chat.currentValue);
    }
  }

  isToday(d: any): boolean {
    const today = new Date()
    let date = new Date(d)
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
  }

  toggleEmoji: boolean = false;
  selectedEMoji(event: any) {
    this.messageString += event.emoji.native;
    this.toggleEmoji = false;
    this.chatInputElament && this.chatInputElament.nativeElement.focus();
  }

  addFile() {
    this.media.askUpload = true;
    let sus = this.media.imgUploaded.subscribe((data: any) => {
      if (data !== false) {
        // console.log(data);
        this.message.sendMediaMessage(this.chat._id, data);
        this.needScroll2 = true;
      } else {
        console.log('cancelled upload')
      }
      sus.unsubscribe();
    })
  }

  onPaste(e: any) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let blob = null;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
        let size = blob.size / 1024 / 1024;
        if (size > 5) {
          this.socket.showError('Size limit exceeded', 'The image must be less than 5 MB');
        }
        else {
          this.addFile();
          this.media.uploader.addToQueue([blob]);
        }
      }
    }
  }

  downloadStart(url: string) {
    this.downloadingUrl = url;
  }

  downloadEnd() {
    this.downloadingUrl = '';
  }

  compose() {
    this.message.getComposedMessage(this.chat._id)
    .then(() => {
      console.log('composed send successfully');
    })
    .catch(() => {
      console.log('error sending compose')
    })
  }

}
