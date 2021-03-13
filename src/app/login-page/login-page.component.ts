import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import {AvatarGroupModule} from 'primeng/avatargroup';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, AfterViewInit {

  mobileView: boolean = false;
  mode: boolean = true //login mode true for login

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileView = event.target.innerWidth < 500 ? true : false;
  }

  constructor() {
    this.mobileView = window.innerWidth < 500 ? true : false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

}
