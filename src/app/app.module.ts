import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG imports
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

// Other Libraries
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';

// Components and services
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginServiceService } from './services/login-service.service';
import { NotFoundComponent } from './not-found/not-found.component'



@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule
  ],
  providers: [
    LoginServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
