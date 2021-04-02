import { ApplicationRef, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessagesServiceService } from '../services/messages-service.service';
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
  messageString: string;

  constructor(public socket: SocketService,
    private message: MessagesServiceService) {
  }

  ngOnInit(): void {
  }

  sendMessage() {
    console.log(this.messageString);   
    this.message.sendMessage(this.chat._id, this.messageString)
    // this.message.addNewChatTo(); 
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
