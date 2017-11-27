import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { DemographicPage } from './demographic';
import { TextMaskModule } from 'angular2-text-mask';

@IonicPage()
@NgModule({
  declarations: [
    DemographicPage,
  ],
  imports: [
    IonicPageModule.forChild(DemographicPage),
    TextMaskModule,
  ],
})
export class DemographicPageModule {}
