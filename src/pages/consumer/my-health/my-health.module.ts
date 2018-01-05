import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyHealthPage } from './my-health';

@NgModule({
  declarations: [
    MyHealthPage,
  ],
  imports: [
    IonicPageModule.forChild(MyHealthPage),
  ],
})
export class MyHealthPageModule {}
