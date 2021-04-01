import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


// PrimeNG imports
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

// Materialize

// Other Libraries
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';

// Components and services
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginServiceService } from './services/login-service.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { SocketService } from './services/socket.service';
import { AllChatComponent } from './all-chat/all-chat.component';
import { PersonWidgetComponent } from './person-widget/person-widget.component';
import { ChatsScreenComponent } from './chats-screen/chats-screen.component';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    NotFoundComponent,
    AllChatComponent,
    PersonWidgetComponent,
    ChatsScreenComponent
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
    SidebarModule,
    ToastModule,
    DialogModule,
    FormsModule
  ],
  providers: [
    LoginServiceService,
    SocketService,
    MessageService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
