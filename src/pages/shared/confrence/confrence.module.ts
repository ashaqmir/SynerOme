import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfrencePage } from './confrence';

@NgModule({
  declarations: [
    ConfrencePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfrencePage),
  ]
})
export class ConfrencePageModule {}
