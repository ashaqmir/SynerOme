import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PractitionerOptionsPage } from './practitioner-options';

@NgModule({
  declarations: [
    PractitionerOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(PractitionerOptionsPage),
  ],
})
export class PractitionerOptionsPageModule {}
