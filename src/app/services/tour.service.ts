import { Injectable } from '@angular/core';
import { NgxbTourService } from 'ngx-ui-tour-ngx-bootstrap';
import { SocketService } from './socket.service';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  onSidebar: boolean = false;
  currentStep: string = '';

  anchoIds: string[] = [
    'cipherButton',
    'sideMenu',
    'SideMenuItems',
    'settingsPage'
  ]

  constructor(
    private user: UserServiceService,
    private socket: SocketService,
    private tourService: NgxbTourService
  ) {
    this.tourService.initialize([
      {
        anchorId: this.anchoIds[0],
        content: 'Control the text visibility encryption. so that no one other than you can read your messages froms screen',
        title: 'Cipher Mode Switch',
        enableBackdrop: true
      },
      {
        anchorId: this.anchoIds[1],
        content: 'Here you can see your account info and a settings menu',
        title: 'Sidebar',
        enableBackdrop: true
      },
      {
        anchorId: this.anchoIds[2],
        content: 'You can acess menu items and settings here',
        title: 'Side Menu',
        enableBackdrop: true
      },
      {
        anchorId: this.anchoIds[3],
        content: 'Change account related info and you can also change Cipher Mode Options here. This settings will be applied to all your devices',
        title: 'Account Settings',
        enableBackdrop: true
      }
    ]);
    this.socket.currentUser.subscribe((user: any) => {
      if (user.user.settings.newUser) {
        console.log('starting tour');
        this.tourService.start()
      }
    })
    this.tourService.end$.subscribe(() => {
      console.log('tour end')
      this.user.askSettings = false;
      this.user.visibleSidebar = false;
    })
    this.tourService.stepShow$.subscribe(val => {
      this.currentStep = val.anchorId;
      if(val.anchorId === this.anchoIds[3]) {
        this.user.askSettings = true;
        this.user.visibleSidebar = false;
      }
      else {
        this.user.askSettings = false;
      }
      if(val.anchorId === this.anchoIds[1] || val.anchorId === this.anchoIds[2]) {
        user.visibleSidebar = true;
      }
      else {
        user.visibleSidebar = false;
      }
    })
  }
}
