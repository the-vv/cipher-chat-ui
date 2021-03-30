import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';

@Component({
  selector: 'app-all-chat',
  templateUrl: './all-chat.component.html',
  styleUrls: ['./all-chat.component.scss']
})
export class AllChatComponent implements OnInit {

  askNew:boolean = false

  chats: Message[] = [
    {
      _id: '12345',
      message: 'this is a long line message fot testing purposes',
      datetime: new Date(),
      from: 'vishnu v',
      to: 'vv1'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
