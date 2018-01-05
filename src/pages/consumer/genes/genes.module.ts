import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenesPage } from './genes';

@NgModule({
  declarations: [
    GenesPage,
  ],
  imports: [
    IonicPageModule.forChild(GenesPage),
  ],
})
export class GenesPageModule {}
