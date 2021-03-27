import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public currentUser: Observable<any>;
  public loginStatus: Observable<any>;
  public signupStatus: Observable<any>;

  public User: User;

  constructor(private socket: Socket) {
    socket.on('connect', () => {
      console.log('Realtime Connection Established');
    })
    this.loginStatus = socket.fromEvent('loginStatus');
    this.signupStatus = socket.fromEvent('signupStatus');
    this.currentUser = socket.fromEvent('authSuccess');
    this.currentUser.subscribe((user) => {
      this.User = user.user;
    })
  }

  logout() {
    // console.log('Logged Out');   
    this.User = null 
  }

  verifyAuth(token: string) {
    this.socket.emit('verifyAuth', token);
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
