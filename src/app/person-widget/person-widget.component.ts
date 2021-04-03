import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output()
  onSelect: EventEmitter<any> = new EventEmitter<any>();

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

}
