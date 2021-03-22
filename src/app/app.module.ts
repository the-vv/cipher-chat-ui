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
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import {SidebarModule} from 'primeng/sidebar';

// Materialize

// Other Libraries
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// Components and services
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginServiceService } from './services/login-service.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { SocketService } from './services/socket.service';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


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
    PasswordStrengthMeterModule,
    MenuModule,
    MenubarModule,
    SocketIoModule.forRoot(config), 
    SidebarModule 
  ],
  providers: [
    LoginServiceService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
