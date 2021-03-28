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
  public isLoggedIn:boolean = false;

  public redirectUrl: string;

  constructor(private socket: Socket) {
    socket.on('connect', () => {
      console.log('Realtime Connection Established');
    })
    this.loginStatus = socket.fromEvent('loginStatus');
    this.signupStatus = socket.fromEvent('signupStatus');
    this.currentUser = socket.fromEvent('authSuccess');
    this.currentUser.subscribe((user) => { //login process
      this.User = user.user;
      this.isLoggedIn = true;
    })
  }

  logout() {
    // console.log('Logged Out');   
    this.User = null 
    this.isLoggedIn = false;
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
