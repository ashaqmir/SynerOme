import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsumerProfilePage } from './consumer-profile';

@NgModule({
  declarations: [
    ConsumerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ConsumerProfilePage),
  ],
})
export class ConsumerProfilePageModule {}
