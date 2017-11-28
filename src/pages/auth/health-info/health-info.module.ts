import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthInfoPage } from './health-info';

@NgModule({
  declarations: [
    HealthInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthInfoPage),
  ],
})
export class HealthInfoPageModule {}
