import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PractitionerDashboardPage } from './practitioner-dashboard';

@NgModule({
  declarations: [
    PractitionerDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(PractitionerDashboardPage),
  ],
})
export class PractitionerDashboardPageModule {}
