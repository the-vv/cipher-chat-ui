import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats-screen',
  templateUrl: './chats-screen.component.html',
  styleUrls: ['./chats-screen.component.scss']
})
export class ChatsScreenComponent implements OnInit {

  @Input()
  chat: any;

  constructor() { }

  ngOnInit(): void {
  }

}
