import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupTypePage } from './signup-type';

@NgModule({
  declarations: [
    SignupTypePage,
  ],
  imports: [
    IonicPageModule.forChild(SignupTypePage),
  ],
})
export class SignupTypePageModule {}
