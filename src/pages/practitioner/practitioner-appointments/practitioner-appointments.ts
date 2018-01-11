import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';
import { IFacetimeRequestView, IProfile, IFacetimeRequest } from '../../../models/models';
import { AppStateServiceProvider } from '../../../providers/app-state-service/app-state-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';
import { LoginPage } from '../../auth/auth';
import { ConfrencePage } from '../../shared/shared';

// import { CalendarComponent } from 'ionic2-calendar/calendar';
// import { MonthViewComponent } from 'ionic2-calendar/monthview';
// import { WeekViewComponent } from 'ionic2-calendar/weekview';
// import { DayViewComponent } from 'ionic2-calendar/dayview';


@IonicPage()
@Component({
  selector: 'page-practitioner-appointments',
  templateUrl: 'practitioner-appointments.html',
})
export class PractitionerAppointmentsPage {
  userProfile: IProfile;
  myAppointments: IFacetimeRequestView[] = [];

  selectedDay = new Date();
  viewTitle: string;

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public appState: AppStateServiceProvider,
    private fDb: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) {
    if (!this.afAuth.auth.currentUser) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log(this.myAppointments);
  }

  ionViewWillLoad() {
    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        if (this.appState.userProfile) {
          this.userProfile = this.appState.userProfile;
          if (this.userProfile) {
            if (this.userProfile.isNutritionist && this.userProfile.nutritionistLicenseNumber) {
              let allrequests;
              this.fDb.database.ref('/faceTimeRequests').orderByChild('idTo').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
                allrequests = snapshot.val();
                this.myAppointments = []
                let currentDateTime = new Date();
                for (var req in allrequests) {
                  var request = allrequests[req]
                  if (request && request.status !== 'deleted') {
                    let faceTime = request;
                    faceTime.startTime = new Date(request.startTime);
                    faceTime.endTime = new Date(request.endTime);

                    if ((currentDateTime >= faceTime.startTime) && (currentDateTime <= faceTime.endTime)) {
                      faceTime.isActive = true;
                      request.isActive = true;
                    } else {
                      faceTime.isActive = false;
                      request.isActive = false;
                    }
                    request.key = req;
                    this.myAppointments.push(faceTime);
                  }
                }
              });
            }
          }
        } else {
          console.log('auth false');
          this.navCtrl.setRoot(LoginPage);
        }
      }
      else {
        console.log('auth false');
        this.navCtrl.setRoot(LoginPage);
      }
    });
    if (this.appState.userProfile) {
      this.userProfile = this.appState.userProfile;
    }


  }

  addEvent() {
    let modal = this.modalCtrl.create('EventModalPage', { selectedDay: this.selectedDay });
    modal.present();
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

  call(callToId, callFromId) {

    let modal = this.modalCtrl.create(ConfrencePage,
      {
        callToId: callToId,
        callFromId: callFromId
      });

    modal.present();
    // console.log(callToId);
    // this.navCtrl.push(ConfrencePage,
    //   {
    //     callToId: callToId,
    //     callFromId: callFromId
    //   });
    //   this.viewCtrl.dismiss();
  }

  acceptCall(requestKey) {
    //let allmyrequeststome = [];
    console.log(requestKey + ' ' + this.myAppointments.length);

    let request = this.myAppointments.find(req => req.key === requestKey);
    console.log(JSON.stringify(request));
    if (request) {

      const reqToUpdate: IFacetimeRequest = {
        idFrom: request.idFrom,
        idTo: request.idTo,
        nameFrom: request.nameFrom,
        nameTo: request.nameTo,
        status: 'accepted',
        callIdTo: this.appState.userProfile.callId,
        callIdFrom: request.callIdFrom,
        startTime: request.startTime,
        endTime: request.endTime,
        title: request.title
      };

      this.fDb.object(`/faceTimeRequests/${requestKey}`).update(reqToUpdate);

    }
  }
  deleteCallReq(requestKey) {

    console.log(requestKey + ' ' + this.myAppointments.length);

    let request = this.myAppointments.find(req => req.key === requestKey);
    console.log(JSON.stringify(request));
    if (request) {

      const reqToUpdate: IFacetimeRequest = {
        idFrom: request.idFrom,
        idTo: request.idTo,
        nameFrom: request.nameFrom,
        nameTo: request.nameTo,
        status: 'deleted',
        callIdTo: request.callIdTo,
        callIdFrom: request.callIdFrom,
        startTime: request.startTime,
        endTime: request.endTime,
        title: request.title
      };

      this.fDb.object(`/faceTimeRequests/${requestKey}`).update(reqToUpdate);

    }
  }

  generateRandom(): number {
    var min = 11111111;
    var max = 99999999;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  getTime(dateTime): string {
    return moment(dateTime).format('HH:mm A');
  }


  ionViewCanEnter() {
    if (this.appState.loginState) {
      return this.appState.loginState;
    } else {
      this.navCtrl.setRoot(LoginPage)
    }
  }
}