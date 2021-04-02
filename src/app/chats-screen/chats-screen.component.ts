import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chats-screen',
  templateUrl: './chats-screen.component.html',
  styleUrls: ['./chats-screen.component.scss']
})
export class ChatsScreenComponent implements OnInit, OnChanges {

  @Input()
  chat: any;

  @Input()
  hasSelected: boolean = false;

  messages: any[];
  currentUserId: string;

  constructor(public socket: SocketService) {
  }

  ngOnInit(): void {
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes.chat.currentValue != undefined) {
      this.currentUserId = this.socket.User._id;
      this.messages = changes.chat.currentValue.messages;
    }
    console.log(this.messages);
  }

}
