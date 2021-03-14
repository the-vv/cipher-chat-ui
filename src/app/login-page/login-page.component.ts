import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, AfterViewInit {

  mobileView: boolean = false;
  mode: boolean = true //login mode true for login

  loginForm: FormGroup;
  SignupForm: FormGroup;

  lpvmode: boolean = true;
  spvmode1: boolean = true;
  spvmode2: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileView = event.target.innerWidth < 500 ? true : false;
  }

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.mobileView = window.innerWidth < 500 ? true : false;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['']
    });
    this.SignupForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      confirmp: ['', Validators.required]
    });
  }

  get sf() { return this.SignupForm.controls; }
  get lf() { return this.loginForm.controls; }

  ngAfterViewInit() {
  }

  onSignup() {
    console.log(this.SignupForm.value);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return
    }
    console.log(this.loginForm.value);
  }

}
