import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
// import { Message } from '../models/message';
import * as rand from 'randomcolor'
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-person-widget',
  templateUrl: './person-widget.component.html',
  styleUrls: ['./person-widget.component.scss']
})
export class PersonWidgetComponent implements OnInit {

  @Input()
  chat: any;

  @Input()
  activeChat: boolean

  @Output()
  onSelect: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onContext: EventEmitter<any> = new EventEmitter<any>();

  randomColor: string = ''

  constructor(
    public socket: SocketService
  ) { }

  ngOnInit(): void {
    // console.log(this.chat);          
    this.randomColor = rand({
      luminosity: 'dark',
      format: 'rgba',
      alpha: 1
    })
  }

  chatSelected() {
    // console.log(this.chat);    
    this.chat.color = this.randomColor;
    this.onSelect.emit(this.chat);
  }

  isToday(d: any): boolean {
    const today = new Date()
    let date = new Date(d)
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
  }

}
