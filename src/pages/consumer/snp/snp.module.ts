import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnpPage } from './snp';

@NgModule({
  declarations: [
    SnpPage,
  ],
  imports: [
    IonicPageModule.forChild(SnpPage),
  ],
})
export class SnpPageModule {}
