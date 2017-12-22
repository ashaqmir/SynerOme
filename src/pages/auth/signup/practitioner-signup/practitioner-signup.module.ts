import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PractitionerSignupPage } from './practitioner-signup';

@NgModule({
  declarations: [
    PractitionerSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(PractitionerSignupPage),
  ],
})
export class PractitionerSignupPageModule {}
