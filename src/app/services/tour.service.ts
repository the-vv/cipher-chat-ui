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
  newUser: boolean;

  anchoIds: string[] = [
    'cipherButton',
    'sideMenu',
    'SideMenuItems',
    'settingsPage',
    'newChatButton'
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
      placement: 'top'
    },
    {
      anchorId: this.anchoIds[4],
      content: 'Start your first chat by clicking the + button',
      title: 'Start messaging',
      enableBackdrop: true,
      placement: 'bottom',
      route: '/chats'
    }
  ]

  constructor(
    private user: UserServiceService,
    private socket: SocketService,
    private tourService: NgxbTourService,
    private tourService2: NgxbTourService
  ) {
    this.tourService.initialize(this.steps);
    this.socket.currentUser.subscribe((user) => {
      this.newUser = user.user.settings.newUser;
      if (user.user.settings.newUser) {
        console.log('starting tour');
        let tourCount = localStorage.getItem('tourCount');
        if (!tourCount || Number(tourCount) < 1) {
          this.tourService.start()
          this.tourService.end$.subscribe(() => {
            console.log('tour end');
            localStorage.setItem('tourCount', '1')
          })
        }
      }
    });
  }

  hasNext(step: INgxbStepOption) {
    if(this.anchoIds.indexOf(step.anchorId) < 0) {
      return false;
    }
    return this.anchoIds.indexOf(step.anchorId) < this.anchoIds.length - 1
  }

  hasPrev(step: INgxbStepOption) {
    if(this.anchoIds.indexOf(step.anchorId) < 0) {
      return false;
    }
    return this.anchoIds.indexOf(step.anchorId) >= 1
  }

  end() {
    this.tourService.end();
  }

  prev(step: INgxbStepOption) {
    if (step.anchorId == this.anchoIds[1]) {
      this.user.visibleSidebar = false;
      setTimeout(() => {
        this.tourService.prev()
      }, 100);
    }
    else if (step.anchorId == this.anchoIds[3]) {
      this.user.visibleSidebar = true;
      this.user.askSettings = false;
      setTimeout(() => {
        this.tourService.prev()
      }, 300);
    }
    else if (step.anchorId == this.anchoIds[4]) {
      this.user.visibleSidebar = false;
      this.user.askSettings = true;
      setTimeout(() => {
        this.tourService.prev()
      }, 500);
    }
    else {
      this.tourService.prev();
    }
  }
  next(step: INgxbStepOption) {
    if (step.anchorId == this.anchoIds[0] || step.anchorId == this.anchoIds[1]) {
      this.user.visibleSidebar = true;
      setTimeout(() => {
        this.tourService.next()
      }, step.anchorId == this.anchoIds[0] ? 500 : 0);
    }
    else if (step.anchorId == this.anchoIds[2]) {
      this.user.askSettings = true;
      this.user.visibleSidebar = false;
      setTimeout(() => {
        this.tourService.next();
      }, 500);
    }
    else if (step.anchorId == this.anchoIds[3]) {
      this.user.askSettings = false;
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

  checkSecondTour() {
    let tourCount = localStorage.getItem('tourCount');
    if (this.newUser === true && tourCount && Number(tourCount) < 2) {
      console.log('inited second Tour')
      this.tourService2.initialize(
        [
          {
            anchorId: 'composeButton',
            content: 'Use the message composer to create a messages with different formatting settings',
            title: 'Introducing Message Composer',
            enableBackdrop: true
          }
        ]
      );
      this.tourService2.start();
      this.tourService2.end$.subscribe(() => {
        this.user.userDetails.settings.newUser = false;
        this.user.saveSettings();
        console.log('tour end');
        localStorage.setItem('tourCount', '2');
      })
    }
  }

}
