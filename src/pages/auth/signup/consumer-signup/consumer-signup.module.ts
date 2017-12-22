import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { ConsumerSignupPage } from './consumer-signup';
import { TextMaskModule } from 'angular2-text-mask';

@IonicPage()
@NgModule({
  declarations: [
    ConsumerSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsumerSignupPage),
    TextMaskModule,
  ],
})
export class SignupPageModule {}
