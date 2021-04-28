import { Component, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { SocketService } from './services/socket.service';
import { CookieService } from 'ngx-cookie-service';
import { NavigationEnd, Router } from '@angular/router';
import { UserServiceService } from './services/user-service.service';
import { MessagesServiceService } from './services/messages-service.service';
import { MediaService } from './services/media.service';
import { TourService } from './services/tour.service';

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

  tnavbar: boolean = true;
  isChatPage: boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    public socket: SocketService,
    private cookieService: CookieService,
    private router: Router,
    public user: UserServiceService,
    public messageService: MessagesServiceService,
    public media: MediaService,
    public tourService: TourService
  ) {
    this.mobileView = window.innerWidth < 500 ? true : false;

    if (cookieService.check('user')) {
      let usr: any = JSON.parse(this.cookieService.get('user'));
      socket.login(usr); 
      socket.verifyAuth(usr.token);
    } else {
      // console.log('Not Logegd in');
    }
  }

  ngOnInit() {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd){
        // console.log(val.url);
        if(val.url.indexOf('/chats') >= 0 && this.socket.isLoggedIn) {
          this.isChatPage = true;
        } else {
          this.isChatPage = false;
        }
      }      
    })
    
    this.primengConfig.ripple = true;

    this.initSidebar();

    this.socket.currentUser.subscribe(user => {
      if (user.user) {
        this.cookieService.set('user', JSON.stringify(user), 2)
        this.sideItems = [
          {
            label: 'Account',
            items: [
              {
                label: 'Logout',
                icon: 'bi bi-box-arrow-left',
                routerLink: '/login',
                command: () => {
                  this.cookieService.delete('user')
                  this.socket.logout();
                  this.visibleSidebar = !this.visibleSidebar;
                  this.initSidebar();
                }
              }
            ]
          },
          {
            label: 'More',
            items: [
              { label: 'Settings',
              icon: 'bi bi-gear',
              command: () => {
                this.user.askSettings = true;
                this.visibleSidebar = !this.visibleSidebar;
              }
            },
            ]
          }
        ];
      }
    })
  }

  initSidebar() {
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
      // {
      //   label: 'More',
      //   items: [
      //     { label: 'Settings', icon: 'bi bi-gear' },
      //   ]
      // }
    ];
  }

}
