import { ApplicationRef, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chats-screen',
  templateUrl: './chats-screen.component.html',
  styleUrls: ['./chats-screen.component.scss']
})
export class ChatsScreenComponent implements OnInit, OnChanges{

  @Input()
  chat: any;

  @Input()
  hasSelected: boolean = false;

  messages: any[];
  currentUserId: string;
  randomColor: string;

  constructor(public socket: SocketService,
    private change: ApplicationRef) {
  }

  ngOnInit(): void {
  }

  setRandCOlor() {
    return {'backgroundColor': this.randomColor}
  }

  ngOnChanges(changes: SimpleChanges) {    
    if (changes.chat.currentValue != undefined) {
      this.currentUserId = this.socket.User._id;
      this.randomColor = changes.chat.currentValue.color;
      this.messages = changes.chat.currentValue.messages;
      console.log(changes.chat.currentValue);
    }
  }

}
