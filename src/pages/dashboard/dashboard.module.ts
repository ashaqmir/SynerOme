import { DashboardPage } from './dashboard';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';

@IonicPage()
@NgModule({
  declarations: [
    DashboardPage
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
  ]
})
export class DashboardPageModule {}
