import { IFacetimeRequest } from '../../../models/facetimeRequest';
import { IProfile } from '../../../models/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppStateServiceProvider } from '../../../providers/app-state-service/app-state-service';


@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})

export class UserListPage {
  otherusers: IProfile[] = [];
  myId: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private fDb: AngularFireDatabase,
    public appState: AppStateServiceProvider,
    private toast: ToastController, ) {

  }



  ionViewDidLoad() {
    let profiles = [];
    this.fDb.database.ref('/profiles').orderByChild('isNutritionist').equalTo(true).on('value', (snapshot) => {
      profiles = snapshot.val();
      for (var prof in profiles) {
        console.log(prof);
        if (prof !== this.appState.userProfile.id) {
          this.otherusers.push(profiles[prof]);
        }
      }
    });
  }

  requestTalk(user) {

    console.log('Requested to: ' + user);
    if (user) {
      let facetimeReq = {} as IFacetimeRequest
      facetimeReq.idFrom = this.appState.userProfile.id;
      facetimeReq.nameFrom = this.appState.userProfile.firstName
      facetimeReq.idTo = user.id;
      facetimeReq.nameTo = user.firstName;
      facetimeReq.status = 'pending';
      facetimeReq.callIdFrom = this.generateRandom();
      facetimeReq.callIdTo = 0;

      this.fDb.list('/faceTimeRequests').push(facetimeReq)
        .then(res => {
          this.toast.create({
            message: 'Request sent!',
            duration: 3000
          }).present();
        });

      // facetimeReq.status = 'pending';
      // this.fDb.database.ref('/faceTimeRequests').child(facetimeReq.idTo).push(facetimeReq)
      //   .then(res => {
      //     this.toast.create({
      //       message: 'Request sent!',
      //       duration: 3000
      //     }).present();
      //   })

    }

    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  generateRandom(): number {
    var min = 11111111;
    var max = 99999999;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
