import { Component, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { SocketService } from './services/socket.service';
import * as rand from 'randomcolor'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.mobileView = event.target.innerWidth < 500 ? true : false;
  }

  public mobileView: boolean = false;

  sideItems: MenuItem[];
  visibleSidebar: boolean;

  randomColor = '';

  constructor(
    private primengConfig: PrimeNGConfig,
    public socket: SocketService
  ) {
    this.mobileView = window.innerWidth < 500 ? true : false;
  }

  ngOnInit() {

    this.randomColor = rand({
      format: 'rgba',
      alpha: 0.5
    })

    this.primengConfig.ripple = true;

    this.sideItems = [
      {
        label: 'Account',
        items: [
          {
            label: 'Login',
            icon: 'bi bi-box-arrow-in-right',
            routerLink: '/login',
            command: () => {
              this.visibleSidebar = !this.visibleSidebar;
            }
          },
          {
            label: 'SignUp',
            icon: 'bi bi-person-plus',
            routerLink: '/login',
            queryParams: { signup: '1' },
            command: () => {
              this.visibleSidebar = !this.visibleSidebar;
            }
          }
        ]
      },
      {
        label: 'More',
        items: [
          { label: 'Settings', icon: 'bi bi-gear' },
        ]
      }
    ];

    this.socket.currentUser.subscribe(user => {
      if (user.user) {
        this.sideItems[0].items = [
          {
            label: 'Logut',
            icon: 'bi bi-box-arrow-left',
            command: () => {
              this.socket.logout();
            }
          }
        ]
      }
    })
  }

}
