import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { KnobModule } from 'primeng/knob';


// Other Libraries
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxAnimationsModule } from 'ngx-animations';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FileUploadModule } from 'ng2-file-upload';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as cloudinary from 'cloudinary-core';


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
import { DecryptPipe } from './decrypt.pipe';
import { UserServiceService } from './services/user-service.service';
import { SettingsComponent } from './settings/settings.component';
import { MstatusPipe } from './mstatus.pipe';
import { FileuploadComponent } from './fileupload/fileupload.component';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    NotFoundComponent,
    AllChatComponent,
    PersonWidgetComponent,
    ChatsScreenComponent,
    DecryptPipe,
    SettingsComponent,
    MstatusPipe,
    FileuploadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    FormsModule,
    NgxSpinnerModule,
    SkeletonModule,
    ConfirmPopupModule,
    NgxAnimationsModule,
    PickerModule,
    InputSwitchModule,
    ToggleButtonModule,
    KnobModule,
    FileUploadModule,
    CloudinaryModule.forRoot(cloudinary, { cloud_name: 'cipherchat' })
  ],
  providers: [
    LoginServiceService,
    SocketService,
    MessageService,
    CookieService,
    ConfirmationService,
    UserServiceService
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
