import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallControlBoxPage } from './callControlBox';

@NgModule({
  declarations: [
    CallControlBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(CallControlBoxPage),
  ],
})
export class CallControlBoxPageModule {}