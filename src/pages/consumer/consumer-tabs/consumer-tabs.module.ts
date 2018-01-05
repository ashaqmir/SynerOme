import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsumerTabsPage } from './consumer-tabs';

@NgModule({
  declarations: [
    ConsumerTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsumerTabsPage),
  ]
})
export class ConsumerTabsPageModule {}
