import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '../models/message';

@Component({
  selector: 'app-person-widget',
  templateUrl: './person-widget.component.html',
  styleUrls: ['./person-widget.component.scss']
})
export class PersonWidgetComponent implements OnInit {

  @Input()
  chat: any;

  @Output()
  onSelect: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {  
    console.log(this.chat);      
  }

}
