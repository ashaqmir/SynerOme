import { IFacetimeRequest } from './../../../models/facetimeRequest';
import { IProfile } from './../../../models/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppStateServiceProvider } from '../../../providers/app-state-service/app-state-service';


@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})

export class UserListPage {
  usersList: Observable<IProfile[]>;
  otherusers: IProfile[] = [];
  myId: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private afAuth: AngularFireAuth,
    private fDb: AngularFireDatabase,
    public appState: AppStateServiceProvider,
    private toast: ToastController, ) {

  }



  ionViewDidLoad() {
    this.usersList = this.fDb.list('/profiles').valueChanges();
    if (this.usersList) {
      this.usersList.forEach(val => {
        val.forEach(prof => {
          console.log(prof.id);
          if (prof.id !== this.appState.userProfile.id) {
            this.otherusers.push(prof);
          }
        });
      })
    }

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
      this.fDb.database.ref('/faceTimeRequests').child(facetimeReq.idTo).push(facetimeReq)
        .then(res => {
          this.toast.create({
            message: 'Request sent!',
            duration: 3000
          }).present();
        })
        
    }

    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
