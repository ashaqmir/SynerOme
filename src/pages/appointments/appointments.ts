import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, FabContainer } from 'ionic-angular';
import { IFacetimeRequestView, IProfile } from '../../models/models';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {
  userProfile: IProfile;
  myAppointments: IFacetimeRequestView[] = [];

  eventSource = [];
  selectedDay = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public appState: AppStateServiceProvider,
    private fDb: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    ) {
  }

  ionViewDidLoad() {
   
  }

  ionViewWillLoad() {

    this.userProfile=this.appState.userProfile ;

    if(this.userProfile){
      if(this.userProfile.isNutritionist && this.userProfile.nutritionistLicenseNumber){
        let allrequests;
        this.fDb.database.ref('/faceTimeRequests').orderByChild('idTo').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
          allrequests = snapshot.val();
          this.myAppointments = []
          for (var req in allrequests) {            
            var request = allrequests[req]
            request.key = req;
            this.myAppointments.push(request);
          }
        });
      }else{
        let allrequests;
        this.fDb.database.ref('/faceTimeRequests').orderByChild('idFrom').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
          allrequests = snapshot.val();
          this.myAppointments = []
          for (var req in allrequests) {            
            var request = allrequests[req]
            request.key = req;
            this.myAppointments.push(request);
          }
        });
      }
    }
  }

  addEvent() {
    let modal = this.modalCtrl.create('EventModalPage', { selectedDay: this.selectedDay });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }


}
