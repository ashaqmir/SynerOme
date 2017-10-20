import { StartupPage } from './startup';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    StartupPage,
  ],
  imports: [
    IonicPageModule.forChild(StartupPage),
  ],
  exports: [
    StartupPage
  ]
})

export class StartupPageModule { }
