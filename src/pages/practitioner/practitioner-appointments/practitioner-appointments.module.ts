import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PractitionerAppointmentsPage } from './practitioner-appointments';
import { NgCalendarModule } from 'ionic2-calendar/calendar.module';

@NgModule({
  declarations: [
    PractitionerAppointmentsPage,
  ],
  imports: [
    NgCalendarModule,
    IonicPageModule.forChild(PractitionerAppointmentsPage),    
  ],
})
export class AppointmentsPageModule {}