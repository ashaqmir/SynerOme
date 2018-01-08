import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppStateServiceProvider } from '../../../providers/app-state-service/app-state-service';
import { Observable } from 'rxjs/Observable';
import { IProfile, IFacetimeRequest } from '../../../models/models';

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {

  event: any;

  minDate: any;
  usersList: Observable<IProfile[]>;
  nutritionistList: IProfile[] = [];
  myId: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private fDb: AngularFireDatabase,
    public appState: AppStateServiceProvider,
    private toast: ToastController,
  ) {


    this.event = {
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      idFrom: this.appState.userProfile.id,
      nameFrom: this.appState.userProfile.firstName + ' ' + this.appState.userProfile.lastName,
      idTo: '',
      nameTo: '',
      callIdFrom: this.appState.userProfile.callId,
      status: 'pending'

    };

    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    if (preselectedDate) {
      this.event.startTime = preselectedDate;
      this.event.endTime = preselectedDate;
    }
    this.minDate = moment().format('YYYY-MM-DDTHH:mm');

  }

  ionViewDidLoad() {
    let profiles = [];
    this.fDb.database.ref('/profiles').orderByChild('isNutritionist').equalTo(true).on('value', (snapshot) => {
      profiles = snapshot.val();
      for (var prof in profiles) {
        console.log(prof);
        if (prof !== this.appState.userProfile.id) {
          this.nutritionistList.push(profiles[prof]);
        }
      }
    });
  }
  requestTalk() {

    console.log('Requested to: ' + this.event);
    if (this.event) {
      let facetimeReq = {} as IFacetimeRequest
      facetimeReq.idFrom = this.event.idFrom;
      facetimeReq.nameFrom = this.event.nameFrom;
      facetimeReq.idTo = this.event.idTo;
      facetimeReq.nameTo = this.event.nameTo;
      facetimeReq.status = 'pending';
      facetimeReq.callIdFrom = this.event.callIdFrom;
      facetimeReq.startTime = this.event.startTime
      facetimeReq.endTime = this.event.endTime;

      facetimeReq.title = facetimeReq.nameFrom + '--' + facetimeReq.nameTo


      facetimeReq.callIdTo = 0;

      this.fDb.list('/faceTimeRequests').push(facetimeReq)
        .then(res => {
          this.toast.create({
            message: 'Request sent!',
            duration: 3000
          }).present();

          this.dismiss();

        });
    }
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  generateRandom(): number {
    var min = 11111111;
    var max = 99999999;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  selectDoctor(doctor) {
    this.event.idTo = doctor.id;
    this.event.nameTo = doctor.firstName + ' ' + doctor.lastName;
  }
}
