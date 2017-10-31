import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfrencePage } from './confrence';
import { NativeAudio } from '@ionic-native/native-audio';

@NgModule({
  declarations: [
    ConfrencePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfrencePage),
  ],
})
export class ConfrencePageModule {}
