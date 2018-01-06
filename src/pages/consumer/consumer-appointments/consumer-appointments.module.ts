import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsumerAppointmentsPage } from './consumer-appointments';

@NgModule({
  declarations: [
    ConsumerAppointmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsumerAppointmentsPage),
    
  ],
})
export class AppointmentsPageModule {}