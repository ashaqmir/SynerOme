//import { NativeAudio } from '@ionic-native/native-audio';
import { Observable } from 'rxjs/Observable';
import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, App } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IFacetimeRequestView } from '../../models/models';
import { ConfrenceServiceProvider } from '../../providers/confrence-service/confrence-service';
//import { CallControlBoxPage } from './callControlBox/callControlBox';

import { IFacetimeRequest } from './../../models/facetimeRequest';



//declare var apiRTC: any

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  userProfile: IProfile;
  chatRequestsToMe: IFacetimeRequestView[] = [];
  chatRequestsByMe: IFacetimeRequestView[] = [];
  // this tells the tabs component which Pages
  // should be each tab's root Page

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
    this.chatRequestsToMe = [];
    this.chatRequestsByMe = [];


    if (!this.afAuth.auth.currentUser) {
      this.navCtrl.setRoot('LoginPage');
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
        console.log(data)
        this.navCtrl.setRoot('WelcomePage');
      }
    });

    let allrequeststome;
    this.fDb.database.ref('/faceTimeRequests').orderByChild('idTo').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
      allrequeststome = snapshot.val();
      console.log
      this.chatRequestsToMe = [];
      for (var req in allrequeststome) {
        console.log(req);
        //this.chatRequestsToMe.push(allrequeststome[req]);
        var request = allrequeststome[req]
        request.key = req;
        this.chatRequestsToMe.push(request);
      }
    });

    let allrequestsbyme;
    this.fDb.database.ref('/faceTimeRequests').orderByChild('idFrom').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
      allrequestsbyme = snapshot.val();
      this.chatRequestsByMe = []
      for (var req in allrequestsbyme) {
        //this.chatRequestsToMe.push(allrequestsbyme[req]);
        console.log(req);
        var request = allrequestsbyme[req]
        request.key = req;
        this.chatRequestsByMe.push(request);
      }
    });

  }

  ionViewDidLoad() {
    //this.AddApiRtcEventListeners();
  }

  loadUsers() {
    const loader = this.loadingCtrl.create(
      {
        content: 'Loading...'
      })
    loader.present()
      .then(() => {
        this.openModel('UserListPage', null);
        loader.dismiss();
      })
  }

  openModel(pageName, userList, ) {
    this.modelCtrl.create(pageName, null, { cssClass: 'inset-modal' })
      .present();
  }

  call(callToId, callFromId) {
    console.log(callToId);

    this.app.getRootNav().setRoot('ConfrencePage',
      {
        callToId: callToId,
        callFromId: callFromId
      });

    // this.navCtrl.setRoot(ConfrencePage,
    //   {
    //     callToId: callToId,
    //     callFromId: callFromId
    //   });
  }

  acceptCall(requestKey) {
    //let allmyrequeststome = [];
    console.log(requestKey + ' ' + this.chatRequestsToMe.length);

    let request = this.chatRequestsToMe.find(req => req.key === requestKey);
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
      };

      this.fDb.object(`/faceTimeRequests/${requestKey}`).update(reqToUpdate);

    }
  }
  deleteCallReq(requestKey) {

    console.log(requestKey + ' ' + this.chatRequestsToMe.length);

    let request = this.chatRequestsToMe.find(req => req.key === requestKey);
    console.log(JSON.stringify(request));
    if (request) {

      const reqToUpdate: IFacetimeRequest = {
        idFrom: request.idFrom,
        idTo: request.idTo,
        nameFrom: request.nameFrom,
        nameTo: request.nameTo,
        status: 'deleted',
        callIdTo: request.callIdTo,
        callIdFrom: request.callIdFrom
      };

      this.fDb.object(`/faceTimeRequests/${requestKey}`).update(reqToUpdate);

    }
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

  // answerCall(inCallerId){

  //   let modal = this.modalCtrl.create(CallControlBoxPage, 
  //     {incommingCallerId: inCallerId}, 
  //     { cssClass: 'inset-modal' });
  //   modal.present();
  // }


  generateRandom(): number {
    var min = 11111111;
    var max = 99999999;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
