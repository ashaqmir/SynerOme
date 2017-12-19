import { DemographicPage } from './demographic';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
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
