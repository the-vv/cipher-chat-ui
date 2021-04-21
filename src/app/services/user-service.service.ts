import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
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
  modeIcon: string = ''

  constructor(
    private socket: SocketService,
    private messageService: MessageService
  ) {
    this.socket.currentUser.subscribe((user: any) => {
      this.originalUser = JSON.parse(JSON.stringify(user));
      this.userDetails = JSON.parse(JSON.stringify(user.user));
    })
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
    this.modeIcon = 'pi pi-spin pi-spinner'
    this.socket.updateUser(this.userDetails)
    .then((d: any) => {
      this.userDetails = JSON.parse(JSON.stringify(d.user));
      this.originalUser = JSON.parse(JSON.stringify(d));
      this.modeIcon = '';
    })
    .catch((e: any) => {
      this.modeIcon = '';
      console.error('Updation Error\n', e);
      this.userDetails = JSON.parse(JSON.stringify(this.originalUser.user));
      this.showError('Error', 'Error while updating details. Please try again')
    })
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
        this.showError('Error', 'Error while updating details. Please try again')
      })
  }
}
