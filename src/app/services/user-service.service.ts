import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  askSettings: boolean = false;
  userDetails: any = {};
  originalUser: any = {};
  editName: boolean = false;

  constructor(
    private socket: SocketService
  ) {
    this.socket.currentUser.subscribe((user: any) => {
      this.originalUser = JSON.parse(JSON.stringify(user));
      this.userDetails = JSON.parse(JSON.stringify(user.user));
    })
  }

  cancelChanges() {
    this.editName = false;
    this.userDetails = JSON.parse(JSON.stringify(this.originalUser.user));
  }

  saveSettings() {
    this.askSettings = false;
    console.log(this.userDetails);
  }
}
