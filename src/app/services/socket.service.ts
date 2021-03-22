import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public currentUser: Observable<User>;

  constructor(private socket: Socket) {
    socket.on('connect', () => {
      console.log('Realtime Connection Established');
    })
    this.currentUser = socket.fromEvent('authSuccess');
    this.currentUser.toPromise().then(() => {
      
    })
  }

  sendAuth(values: any, isLogin: boolean) {
    if (isLogin) {
      this.socket.emit('loginAuth', values);
    }
    else {
      this.socket.emit('signupAuth', values);
    }
  }

}
