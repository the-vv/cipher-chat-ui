import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
// import { Message } from '../models/message';
import * as rand from 'randomcolor'
import { SocketService } from '../services/socket.service';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-person-widget',
  templateUrl: './person-widget.component.html',
  styleUrls: ['./person-widget.component.scss']
})
export class PersonWidgetComponent implements OnInit {

  items: MenuItem[];

  @Input()
  chat: any;

  @Input()
  activeChat: boolean

  @Output()
  onSelect: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onContext: EventEmitter<any> = new EventEmitter<any>();
  
  @Output()
  onDelete: EventEmitter<any> = new EventEmitter<any>();

  randomColor: string = '';
  displayDelete: boolean = false;

  constructor(
    public socket: SocketService,
    private confirmationService: ConfirmationService
  ) { }

  confirm(event: Event) {
    this.confirmationService.close();
    this.confirmationService.confirm({ 
      target: event.target,
      message: `Are you sure to delete all the chat with \'${this.socket.User._id == this.chat._id ? 'You' : this.chat.name}\'?`,
      icon: 'pi pi-exclamation-triangle', 
      accept: () => {
        this.onDelete.emit(this.chat)
      },
      reject: () => {
        //reject action
      }
    });
  }

  ngOnInit(): void {
    this.randomColor = rand({
      luminosity: 'dark',
      format: 'rgba',
      alpha: 1
    })

    this.items = [{
      label: 'Options',
      items: [
        {
          label: 'Delete Chat',
          icon: 'pi ppi-trash',
          command: () => {
            console.log('delete', this.chat.name);
          }
        }
      ]
    }
    ];
  }

  chatSelected() {
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

  mouseEnter() {
    this.displayDelete = true;
  }

  mouseLeave() {
    this.displayDelete = false;
  }

}
