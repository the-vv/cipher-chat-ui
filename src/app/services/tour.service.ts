import { Injectable } from '@angular/core';
import { NgxbTourService } from 'ngx-ui-tour-ngx-bootstrap';
import { INgxbStepOption } from 'ngx-ui-tour-ngx-bootstrap/lib/step-option.interface';
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

  steps: INgxbStepOption[] = [
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
      enableBackdrop: true,
      placement: 'bottom'
    }
  ]

  constructor(
    private user: UserServiceService,
    private socket: SocketService,
    private tourService: NgxbTourService
  ) {
    this.tourService.initialize(this.steps);
    this.socket.currentUser.subscribe((user: any) => {
      if (user.user.settings.newUser) {
        console.log('starting tour');
        // this.tourService.start()
      }
    });
    this.tourService.end$.subscribe(() => {
      console.log('tour end');
    })
  }

  hasNext(step: INgxbStepOption) {
    return this.anchoIds.indexOf(step.anchorId) < this.anchoIds.length - 1
  }

  hasPrev(step: INgxbStepOption) {
    return this.anchoIds.indexOf(step.anchorId) >= 1
  }

  end() {
    this.tourService.end();
  }

  prev(step: INgxbStepOption) {
    if(step.anchorId == this.anchoIds[1]) {
      this.user.visibleSidebar = false;
      setTimeout(() => {
        this.tourService.prev()
      }, 100);
    }
    else {
      this.tourService.prev();
    }
  }
  next(step: INgxbStepOption) {
    if(step.anchorId == this.anchoIds[0] || step.anchorId == this.anchoIds[1]) {
      this.user.visibleSidebar = true;
      setTimeout(() => {
        this.tourService.next() 
      }, step.anchorId == this.anchoIds[0] ? 500 : 0);
    }
    else if(step.anchorId == this.anchoIds[2]) {
      this.user.askSettings = true;
      this.user.visibleSidebar = false;
      setTimeout(() => {
        this.tourService.next();
      }, 500);
    }
    else {
      this.tourService.next();
      this.user.visibleSidebar = false;
    } 
  }
}
