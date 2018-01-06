import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PractitionerTabsPage } from './practitioner-tabs';


@NgModule({
  declarations: [
    PractitionerTabsPage
  ],
  imports: [
    IonicPageModule.forChild(PractitionerTabsPage)
  ]
})
export class PractitionerTabsPageModule {}
