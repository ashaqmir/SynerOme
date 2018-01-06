import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { PractitionerProfilePage } from './practitioner-profile';

@IonicPage()
@NgModule({
  declarations: [
    PractitionerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PractitionerProfilePage),
  ]
})

export class UserProfilePageModule {}
