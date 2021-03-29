import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '../models/message';

@Component({
  selector: 'app-person-widget',
  templateUrl: './person-widget.component.html',
  styleUrls: ['./person-widget.component.scss']
})
export class PersonWidgetComponent implements OnInit {

  @Input()
  chat: Message;

  @Output()
  onSelect: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {    
  }

}
