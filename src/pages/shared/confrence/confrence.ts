import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppStateServiceProvider } from '../../../providers/app-state-service/app-state-service';
import { ConfrenceServiceProvider } from '../../../providers/providers';



@IonicPage()
@Component({
  selector: 'page-confrence',
  templateUrl: 'confrence.html',
})

export class ConfrencePage {
  showCall: boolean;
  showIncomming: boolean;
  showInCall: boolean;
  showStatus: boolean;

  calleeId: string = '';
  callerId: string = '';

  muted: boolean = false;


  incomingCallId: string;
  inCall: boolean = false;

  private confSvc: any;
  private appState: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fAuth: AngularFireAuth,
    public events: Events,
    appState: AppStateServiceProvider,
    private alertCtrl: AlertController,
    confService: ConfrenceServiceProvider
  ) {
    this.confSvc = confService;
    this.appState = appState;

    this.calleeId = this.navParams.get('callToId');
    this.callerId = this.navParams.get('callFromId');



    // if (this.fAuth.auth.currentUser) {
    //   //var proccessing = false;
    //   // if (this.incomingCallId && proccessing) {
    //   //   proccessing = true;
    //   //   console.log('Answering..');
    //   //   this.answerCall(this.incomingCallId);
    //   // }

    //   // if (this.outgoingCalleeId && proccessing) {
    //   //   proccessing = true;
    //   //   console.log('Calling..');
    //   //   this.makeCall(this.outgoingCalleeId);
    //   // }
    // } else {
    //   this.navCtrl.setRoot('LoginPage');
    // }
  }


  ionViewDidLoad() {

    this.events.subscribe('incomingCall', evt => {
      this.incomingCallHandler(evt);
    });

    this.events.subscribe('userMediaError', evt => {
      this.userMediaErrorHandler(evt);
    });

    this.events.subscribe('remoteStreamAdded', evt => {
      this.remoteStreamAddedHandler(evt);
      console.log('Remote Media added REMOTE');
    });

    this.events.subscribe('userMediaSuccess', evt => {
      this.userMediaSuccessHandler(evt);
    });

    this.events.subscribe('hangup', evt => {
      this.hangupHandler(evt);
    });

    this.sessionReadyHandler();
  }

  sessionReadyHandler() {
    if (!this.callerId) {
      this.confSvc.initialize().then(data => {
        let infoLabel = "Your local ID : " + this.confSvc.sessionId;
        console.log(infoLabel);
        this.ShowCallWaitingControls();
      });
    } else {
      this.confSvc.initialize(this.callerId).then(data => {
        let infoLabel = "Your local ID : " + this.confSvc.sessionId;
        console.log(infoLabel);
        this.ShowCallWaitingControls();
      });
    }
  }

  ionViewWillLoad() {
    if (!this.fAuth.auth.currentUser) {
      this.navCtrl.setRoot('LoginPage');
    }
  }

  incomingCallHandler(e) {
    this.incomingCallId = e.detail.callId;
    if (this.incomingCallId) {
      this.ShowIncomingCallControls();
    }
  }

  remoteStreamAddedHandler(e) {
    console.log("remoteStreamAddedHandler", e);

    this.confSvc.webRTCClient.addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      "remote",
      'remoteElt-' + e.detail.callId,
      { width: "100%" },
      false
    );
    //this.currentCallId = e.detail.callId;
    //setTimeout(this.refreshVideoView, 100);
    console.log('REMOTE MEDIA ADDED');
  }

  userMediaSuccessHandler(e) {
    console.log("userMediaSuccessHandler", e);
    this.confSvc.webRTCClient.addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      "mini",
      'miniElt-' + e.detail.callId,
      { width: "128px", height: "96px" },
      true
    );
    //this.calleeId = e.detail.callId;
    console.log('USER MEDIA ADDED');
  }

  userMediaErrorHandler(e) {
  }


  removeMediaElements(callId) {
    this.confSvc.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.confSvc.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

  hangupHandler(e) {
    console.log("hangupHandler");

    this.removeMediaElements(e.detail.callId);
    this.ShowCallWaitingControls();
  }

  leave() {

    const alert = this.alertCtrl.create({
      title: 'Leave meeting?',
      message: 'Do you want leave this meeting?',
      buttons: [
        {
          text: 'Stay',
          role: 'cancel',
          handler: () => {
            console.log('Stay clicked');
          }
        },
        {
          text: 'Leave',
          handler: () => {
            console.log('Leave clicked');
            this.hangup();
            //apiRTC.disconnect();
            //this.navCtrl.setRoot(HomePage)
          }
        }
      ]
    });
    alert.present();
  }

  muteMe() {
    this.muted = !this.muted;
  }

  reversecamera() {
    console.log('Participents clicked.');
  }


  makeCall(calleeId) {
    var callId = this.confSvc.webRTCClient.call(calleeId);
    if (callId != null) {
      this.ShowInCallControls();
    }
  }

  call() {
    console.log('calling to:' + this.calleeId);
    this.makeCall(this.calleeId);
  }

  hangup() {
    this.confSvc.webRTCClient.hangUp(this.incomingCallId);
    this.ShowCallWaitingControls();
  }


  answerCall(incomingCallId) {
    if (this.confSvc.webRTCClient) {
      this.confSvc.webRTCClient.acceptCall(incomingCallId);
    }
    // // this.nativeAudio.stop('uniqueI1').then(() => { }, () => { });

    this.ShowCallWaitingControls();
  }


  back() {
    const alert = this.alertCtrl.create({
      title: 'Leave meeting?',
      message: 'Do you want leave this meeting?',
      buttons: [
        {
          text: 'Stay',
          role: 'cancel',
          handler: () => {
            console.log('Stay clicked');
          }
        },
        {
          text: 'Leave',
          handler: () => {
            console.log('Leave clicked');
            this.removeMediaElements(this.incomingCallId);
            this.hangup();
            this.navCtrl.pop().then(() => {
              console.log('Clearing apiRTC');
            })

            // .then(() => {
            //   // first we find the index of the current view controller:
            //   const index = this.viewCtrl.index;
            //   // then we remove it from the navigation stack
            //   this.navCtrl.remove(index);
            // });

          }
        }
      ]
    });
    alert.present();

  }
  ShowInCallControls() {
    console.log('Intialize IN call controls');
    this.showCall = false;
    this.showIncomming = false;
    this.showInCall = true;
  }

  ShowIncomingCallControls() {
    console.log('Intialize incomming call controls');
    this.showIncomming = true;
    this.showCall = false;
    this.showInCall = false;
  }

  ShowCallWaitingControls() {
    console.log('Intialize call waiting controls');
    this.showCall = true;
    this.showInCall = false;
    this.showIncomming = false;
  }

  answer() {
    this.confSvc.webRTCClient.acceptCall(this.incomingCallId);
    this.ShowInCallControls();
  }
  reject() {
    this.confSvc.webRTCClient.refuseCall(this.incomingCallId);
  }
}
