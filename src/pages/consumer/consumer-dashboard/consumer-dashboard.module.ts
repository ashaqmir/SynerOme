import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { ConsumerDashboardPage } from './consumer-dashboard';

@IonicPage()
@NgModule({
  declarations: [
    ConsumerDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsumerDashboardPage),
  ],
})
export class ConsumerDashboardPageModule {}
