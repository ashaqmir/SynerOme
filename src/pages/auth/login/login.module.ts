import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { LoginPage } from './login';
import { TextMaskModule } from 'angular2-text-mask';

@IonicPage()
@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage)
  ],
})
export class LoginPageModule {}
