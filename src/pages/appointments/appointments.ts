import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { IFacetimeRequestView, IProfile, IFacetimeRequest } from '../../models/models';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';
import { ConfrencePage, LoginPage } from '../pages';


@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {
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
                for (var req in allrequests) {
                  var request = allrequests[req]
                  if (request && request.status !== 'deleted') {
                    let faceTime = request;
                    faceTime.startTime = new Date(request.startTime);
                    faceTime.endTime = new Date(request.endTime);

                    request.key = req;
                    this.myAppointments.push(faceTime);
                  }
                }
              });
            } else {
              let allrequests;
              this.fDb.database.ref('/faceTimeRequests').orderByChild('idFrom').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
                allrequests = snapshot.val();
                this.myAppointments = []
                for (var req in allrequests) {
                  var request = allrequests[req]
                  if (request && request.status !== 'deleted') {
                    let faceTime = request;
                    faceTime.startTime = new Date(request.startTime);
                    faceTime.endTime = new Date(request.endTime);

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
    console.log(callToId);
    this.navCtrl.push(ConfrencePage,
      {
        callToId: callToId,
        callFromId: callFromId
      });
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
        callIdTo: this.generateRandom(),
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

}
