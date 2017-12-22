import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PractitionerConditionsPage } from './practitioner-conditions';

@NgModule({
  declarations: [
    PractitionerConditionsPage,
  ],
  imports: [
    IonicPageModule.forChild(PractitionerConditionsPage),
  ],
})
export class PractitionerConditionsPageModule {}
