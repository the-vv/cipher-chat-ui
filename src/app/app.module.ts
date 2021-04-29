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
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DeferModule } from 'primeng/defer';


// Other Libraries
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from "ngx-spinner";
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FileUploadModule as ng2FileUploader } from 'ng2-file-upload';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { FileSaverModule } from 'ngx-filesaver';


// Components and services
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RestApiService } from './services/restApis.service';
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
import { MediaService } from './services/media.service';
import { TourNgxBootstrapModule } from 'ngx-ui-tour-ngx-bootstrap';
import { TourService } from './services/tour.service';
import { QuillModule } from 'ngx-quill';


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
    PickerModule,
    InputSwitchModule,
    ToggleButtonModule,
    KnobModule,
    ng2FileUploader,
    ProgressSpinnerModule,
    DeferModule,
    LazyLoadImageModule,
    BadgeModule,
    NgImageFullscreenViewModule,
    GalleryModule,
    LightboxModule,
    FileSaverModule,
    TourNgxBootstrapModule.forRoot(),
    QuillModule.forRoot()
  ],
  providers: [
    RestApiService,
    SocketService,
    MessageService,
    CookieService,
    ConfirmationService,
    UserServiceService,
    MediaService,
    TourService
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
