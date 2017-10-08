import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { ProfilePage } from './profile';
import { TextMaskModule } from 'angular2-text-mask';

@IonicPage()
@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TextMaskModule,
  ],
})
export class ProfilePageModule {}
