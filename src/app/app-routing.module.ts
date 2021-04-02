import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllChatComponent } from './all-chat/all-chat.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NotFoundComponent } from './not-found/not-found.component'
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'chats', component: AllChatComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
