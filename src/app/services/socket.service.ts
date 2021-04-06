import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public currentUser: Observable<any>;
  public loginStatus: Observable<any>;
  public signupStatus: Observable<any>;
  public messages: Observable<any>;


  public User: User;
  public isLoggedIn: boolean = false;

  public redirectUrl: string;

  constructor(public socket: Socket) {
    socket.on('connect', () => {
      console.log('Realtime Connection Established');
    })
    this.messages = socket.fromEvent('setMessages');
    this.loginStatus = socket.fromEvent('loginStatus');
    this.signupStatus = socket.fromEvent('signupStatus');
    this.currentUser = socket.fromEvent('authSuccess');
    this.currentUser.subscribe(this.login)
  }

  login = (user: any) => {
    if (!this.isLoggedIn) {
      this.User = user.user;
      this.isLoggedIn = true;
    }
    else if (this.User._id != user.user._id) {
      console.log('Logged In User Error');
    }
  }

  logout() {
    // console.log('Logged Out');   
    this.User = null
    this.isLoggedIn = false;
    this.socket.emit('logout', {})
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

  getMessages() {
    return new Promise((resolve, reject) => {
      if (!this.User) {
        reject({ error: 'Not Logged in', success: false })
      }
      this.socket.emit('getMessages', this.User, (messages: any) => {
        resolve(messages)
      })
    })
  }

  saveMessage(message: Message) {
    return new Promise((resolve, reject) => {
      this.socket.emit('newMessage', message, (status: any) => {
        if (status.success) {
          resolve(status);
        }
        else {
          reject(status);
        }
      });
    })
  }

  checkMailExist(email: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('emailCheck', email, (result: any) => {
        if (result.success) {
          resolve(result)
        } else {
          resolve(false)
        }
        if (result.error) {
          reject(result.status);
        }
      })
    })
  }


}
