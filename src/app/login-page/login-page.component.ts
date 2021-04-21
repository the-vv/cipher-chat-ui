import { OnDestroy, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  mobileView: boolean = false;
  mode: boolean = true //login mode true for login

  loginForm: FormGroup;
  SignupForm: FormGroup;
 
  // password visibility modes
  lpvmode: boolean = true;
  spvmode1: boolean = true;
  spvmode2: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.mobileView = event.target.innerWidth < 500 ? true : false;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private socket: SocketService,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    this.mobileView = window.innerWidth < 500 ? true : false;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
    this.SignupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      confirmp: ['', Validators.required]
    });
    this.route.queryParams
      .subscribe(params => {
        if (params.signup == 1) {
          this.mode = false;
        }
        else {
          this.mode = true;
        };
      }
      );
    this.socket.currentUser
      .subscribe(user => {
        if (user) {      
          console.log(this.socket.redirectUrl);  
          console.log(user)  
          this.spinner.hide();        
          this.router.navigate([this.socket.redirectUrl ? this.socket.redirectUrl : '/'], {replaceUrl: true});
        }
      })
    this.socket.loginStatus.subscribe(data => {
      console.log(data);
      this.spinner.hide();        
    })
    this.socket.signupStatus.subscribe(data => {
      console.log(data);
      this.spinner.hide();        
    })
  }

  showError(title: string, message: string) {
    this.messageService.clear()
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 5000 });
  }

  get sf() { return this.SignupForm.controls; }
  get lf() { return this.loginForm.controls; }

  ngOnDestroy() {
    
  }

  onSignup() {
    if (this.SignupForm.value.password != this.SignupForm.value.confirmp || this.SignupForm.invalid) {
      console.log('INVALID FORM');
      return
    }
    this.spinner.show();
    // console.log(this.SignupForm.value);
    this.socket.sendAuth(this.SignupForm.value, false);    
  }

  onLogin() {
    if (this.loginForm.invalid) {
      console.log('INVALID FORM');
      return
    }
    this.spinner.show();
    this.socket.sendAuth(this.loginForm.value, true);
  }

}
