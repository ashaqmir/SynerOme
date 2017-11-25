//import { NativeAudio } from '@ionic-native/native-audio';
import { Observable } from 'rxjs/Observable';
import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, App, FabContainer } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IFacetimeRequestView } from '../../models/models';
import { ConfrenceServiceProvider } from '../../providers/confrence-service/confrence-service';
//import { CallControlBoxPage } from './callControlBox/callControlBox';

import { IFacetimeRequest } from './../../models/facetimeRequest';
import { CallControlBoxPage, LoginPage, ConfrencePage, UserListPage } from '../pages';



//declare var apiRTC: any

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  userProfile: IProfile;


  myCallerId: number = 0;

  incomingCallId;
  incomingCall: boolean = false;
  constructor(public navCtrl: NavController,
    public appState: AppStateServiceProvider,
    private afAuth: AngularFireAuth,
    private fDb: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private modelCtrl: ModalController,
    private app: App,
    public modalCtrl: ModalController,
    //private confProvider: ConfrenceServiceProvider,
    //private nativeAudio: NativeAudio
  ) {
    //this.confProvider.InitializeApiRTC();
    //this.AddApiRtcEventListeners();
  }

  ionViewWillLoad() {


    if (!this.afAuth.auth.currentUser) {
      this.navCtrl.setRoot(LoginPage);
    }

    this.afAuth.authState.take(1).subscribe(data => {
      if (data && data.uid) {
        const profRef = this.fDb.object(`profiles/${data.uid}`);

        profRef.snapshotChanges().subscribe(profData => {
          this.userProfile = profData.payload.val();
          this.appState.userProfile = this.userProfile;
        });
        //this.userProfile= this.fDb.object(`profiles/${data.uid}`);
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ionViewDidLoad() {
    //this.AddApiRtcEventListeners();
  }



  openModel(pageName, userList, ) {
    this.modelCtrl.create(pageName, null, { cssClass: 'inset-modal' })
      .present();
  }



  // AddApiRtcEventListeners() {
  //   console.log('incoming listner added');
  //   apiRTC.addEventListener("incomingCall", (e) => {
  //     this.incomingCallId = e.detail.callId;
  //     this.incomingCall = true;
  //     console.log('call from: ' +  this.incomingCallId);
  //     let modal = this.modalCtrl.create(CallControlBoxPage, 
  //       {incommingCallerId: this.incomingCallId}, 
  //       { cssClass: 'inset-modal' });
  //     modal.present();
  //   });
  // }

  // makeCall(callToId) {
  //   var callId = this.confProvider.confrenceClient.call(callToId);
  //   if (callId != null) {
  //     this.incomingCallId = callId;
  //   }
  // }

  answerCall(inCallerId) {

    let modal = this.modalCtrl.create(CallControlBoxPage,
      { incommingCallerId: inCallerId },
      { cssClass: 'inset-modal' });
    modal.present();
  }


  generateRandom(): number {
    var min = 11111111;
    var max = 99999999;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  signOut(fab: FabContainer) {
    fab.close();
    this.afAuth.auth.signOut()
      .then(data => {
        this.navCtrl.parent.parent.setRoot(LoginPage)
      })
      .catch(error => {
        console.log(error);
      })
  }
}
