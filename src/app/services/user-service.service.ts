import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  askSettings: boolean = false;
  userDetails: any = {};
  originalUser: any = {};
  editName: boolean = false;
  submitted: boolean = false;
  saveIcon: string = 'pi-check';
  publicCryptoKey: string = '';
  modeIcon: string = '';
  verifyUser: boolean = false;
  verifyPasswordString: string;
  verifyPasswordError: string;
  verifyButtonIcon: string = 'pi pi-check-circle';
  verificationEvents: Subject<boolean> = new Subject();

  constructor(
    private socket: SocketService,
    private messageService: MessageService
  ) {
    this.socket.currentUser.subscribe((user: any) => {
      this.originalUser = JSON.parse(JSON.stringify(user));
      this.userDetails = JSON.parse(JSON.stringify(user.user));
      this.modeIcon = this.userDetails.settings.encryption ? 'pi-check' : 'pi-times';
    })
  }

  verifyPassword() {
    if (this.verifyPasswordString?.length) {
      this.verifyPasswordError = 'Checking...';
      this.verifyButtonIcon = 'pi pi-spin pi-spinner';
      this.socket.verifyPassword(this.verifyPasswordString)
        .then(status => {
          if (status === true) {
            this.verificationEvents.next(true)
          } else if (status === false) {
            this.verificationEvents.next(false)
          }
        })
        .catch((_) => {
          this.verificationEvents.next(false)
        })
    }
  }

  onVerify(flag: boolean = false) {
    if (!flag) {
      this.verifyPasswordString = '';
      this.verifyPasswordError = '';
      console.log('closed verify');
      this.verifyButtonIcon = 'pi pi-check-circle';
    }
  }

  showError(title: string, message: string) {
    this.messageService.clear()
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 5000 });
  }

  makeRandomKey(length: number) {
    let result = [];
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() *
        charactersLength)));
    }
    return result.join('');
  }

  cancelChanges() {
    this.editName = false;
    if (!this.submitted) {
      this.userDetails = JSON.parse(JSON.stringify(this.originalUser.user));
    }
  }


  updateViewMode() {
    if (!this.userDetails.settings.encryption) {
      this.userDetails.settings.encryption = true;
      this.modeIcon = 'pi-spin pi-spinner'
      this.socket.updateUser(this.userDetails)
        .then((d: any) => {
          this.userDetails = JSON.parse(JSON.stringify(d.user));
          this.originalUser = JSON.parse(JSON.stringify(d));
          this.modeIcon = this.userDetails.settings.encryption ? 'pi-check' : 'pi-times';
        })
        .catch((e: any) => {
          console.error('Updation Error\n', e);
          this.userDetails = JSON.parse(JSON.stringify(this.originalUser.user));
          this.showError('Error', 'Error while updating details. Please try again');
          this.modeIcon = this.userDetails.settings.encryption ? 'pi-check' : 'pi-times';
        })
    }
    else {
      this.verifyUser = true;
      this.verificationEvents.subscribe(res => {
        if (res === true) {
          this.verifyUser = false;
          this.userDetails.settings.encryption = false;
          this.modeIcon = 'pi-spin pi-spinner'
          this.socket.updateUser(this.userDetails)
            .then((d: any) => {
              this.userDetails = JSON.parse(JSON.stringify(d.user));
              this.originalUser = JSON.parse(JSON.stringify(d));
              this.modeIcon = this.userDetails.settings.encryption ? 'pi-check' : 'pi-times';
            })
            .catch((e: any) => {
              console.error('Updation Error\n', e);
              this.userDetails = JSON.parse(JSON.stringify(this.originalUser.user));
              this.showError('Error', 'Error while updating details. Please try again');
              this.modeIcon = this.userDetails.settings.encryption ? 'pi-check' : 'pi-times';
            })
        }
        else {
          // this.verifyUser = false;
          console.log('wrong password');
          this.verifyPasswordError = 'Wrong Password';
          this.verifyButtonIcon = 'pi pi-check-circle';
        }
      })
    }
  }

  saveSettings() {
    this.submitted = true;
    this.saveIcon = 'pi-spin pi-spinner'
    this.socket.updateUser(this.userDetails)
      .then((d: any) => {
        this.saveIcon = 'pi-check';
        this.submitted = false;
        this.userDetails = JSON.parse(JSON.stringify(d.user));
        this.originalUser = JSON.parse(JSON.stringify(d));
        this.editName = false;
        this.askSettings = false;        
        this.modeIcon = this.userDetails.settings.encryption ? 'pi-check' : 'pi-times';
      })
      .catch((e: any) => {
        this.saveIcon = 'pi-check'
        this.submitted = false;
        this.editName = false;
        this.askSettings = false;
        if (!this.submitted) {
          this.userDetails = JSON.parse(JSON.stringify(this.originalUser.user));
        }
        console.error('Updation Error\n', e);
        this.showError('Error', 'Error while updating details. Please try again');
        this.modeIcon = this.userDetails.settings.encryption ? 'pi-check' : 'pi-times';
      })
  }
}
