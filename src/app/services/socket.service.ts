import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { MessageService } from 'primeng/api';
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
  public messageReadStatus: Observable<any>;

  public User: User;
  public isLoggedIn: boolean = false;

  public redirectUrl: string;

  constructor(
    public socket: Socket,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {
    socket.on('connect', () => {
      console.log('Realtime Connection Established');
      if (this.isLoggedIn) {
        this.socket.emit('verifyAuth', JSON.parse(this.cookieService.get('user')).token);
        console.log('Verifying on reconnect')
      }
    })
    this.messages = socket.fromEvent('setMessages');
    this.loginStatus = socket.fromEvent('loginStatus');
    this.signupStatus = socket.fromEvent('signupStatus');
    this.currentUser = socket.fromEvent('authSuccess');
    this.messageReadStatus = socket.fromEvent('updateMessages');
    this.currentUser.subscribe(this.login); 
    socket.on('updatedUser', (user: any) => {
      if (cookieService.check('user')) {
        let usr: any = JSON.parse(this.cookieService.get('user'));
        this.User = user.user;
        let newUser = { token: usr.token, user: user.user }
        this.cookieService.set('user', JSON.stringify(newUser), 2)
      }
    })
    this.loginStatus.subscribe(data => {
      this.showError('Error', data.status);
      this.isLoggedIn = false;
      this.User = null;
      this.cookieService.delete('user');
      this.router.navigate(['/login'], { replaceUrl: true });
    })
    this.signupStatus.subscribe(data => {
      this.showError('Error', data.status);
      this.isLoggedIn = false;
      this.User = null;
      this.cookieService.delete('user');
      this.router.navigate(['/login'], { replaceUrl: true });
    })
  }

  showError(title: string, message: string) {
    this.messageService.clear()
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 5000 });
  }

  login = (user: any) => {
    if (!this.isLoggedIn) {
      this.User = user.user;
      this.isLoggedIn = true;
    }
    else if (this.User._id != user.user._id) {
      console.error('Logged In User Mismatch Error');
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

  deleteMessages(mess: any[]) {
    return new Promise((resolve, reject) => {
      this.socket.emit('deleteMessages', mess, (result: any) => {
        if (result) {
          resolve(result)
        } else {
          reject(result)
        }
      });
    })
  }

  updateUser(user: any) {
    return new Promise((resolve, reject) => {
      this.socket.emit('updateUser', user, (result: any) => {
        if (result) {
          resolve(result)
        } else {
          reject(result)
        }
      });
    })
  }

  verifyPassword(password: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('verifyPassword', { password: password, email: this.User.email }, (result: any) => {
        if (result.success !== null) {
          resolve(result.success)
        } else {
          this.showError('Error', result.error);
          reject(result.error);
        }
      })
    })
  }

  updateMessageRead(mid: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('updateMessageRead', mid, (result: any) => {
        if (result.success !== null) {
          resolve(result.success)
        } else {
          console.log('Error', result.error);
          reject(result.error);
        }
      })
    })
  }

  updateMessageStatus(id: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('updateMessageSeen', id, (result: any) => {
        if (result.success !== null) {
          resolve(result.success)
        } else {
          console.log('Error', result.error);
          reject(result.error);
        }
      })
    })
  }

}
