import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ConfrenceServiceProvider, AppStateServiceProvider } from '../../../providers/providers';




@IonicPage()
@Component({
  selector: 'page-confrence',
  templateUrl: 'confrence.html',
})

export class ConfrencePage {

  calling: boolean = false;
  callReady: boolean = false;
  callIncomming: boolean = false;
  inCall: boolean = false;
  muted: boolean = false;


  currentCallId: string;
  calleeId: string
  callerId: string
  callerEmail: string;
  private confSvc: any;
  private appState: any;

  incommingCallerName: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fAuth: AngularFireAuth,
    public events: Events,
    appState: AppStateServiceProvider,
    private alertCtrl: AlertController,
    confService: ConfrenceServiceProvider) {
    this.confSvc = confService;
    this.appState = appState;

    this.calleeId = this.navParams.get('callToId');
    this.callerId = this.navParams.get('callFromId');

    console.log(`Caller: ${this.callerId}`);
    console.log(`Reciver: ${this.calleeId}`);

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

  ionViewDidLeave() {
    this.events.publish('viewLoaded', { viewName: '' });

    this.events.unsubscribe('incomingCall')
    this.events.unsubscribe('callEstablished')
    this.events.unsubscribe('userMediaError')
    this.events.unsubscribe('userMediaSuccess')
    this.events.unsubscribe('remoteStreamAdded')
    this.events.unsubscribe('hangup')
  }

  ionViewDidLoad() {

    this.events.publish('viewLoaded', { viewName: 'confrence' });

    this.callerEmail = this.appState.userProfile.email;

    this.events.subscribe('incomingCall', evt => {
      this.incomingCallHandler(evt);
    });
    this.events.subscribe('callEstablished', evt => {
      this.callEstablishedHandler(evt);
    });
    this.events.subscribe('userMediaError', evt => {
      this.userMediaErrorHandler(evt);
    });

    this.events.subscribe('userMediaSuccess', evt => {
      this.userMediaSuccessHandler(evt);
    });

    this.events.subscribe('remoteStreamAdded', evt => {
      this.remoteStreamAddedHandler(evt);
      console.log('Remote Media added REMOTE');
    });

    this.events.subscribe('hangup', evt => {
      this.hangupHandler(evt);
    });

    this.sessionReadyHandler();
  }

  sessionReadyHandler() {
    // this.confSvc.initialize(this.callerId, this.callerEmail).then(data => {
    //   let infoLabel = "Your local ID : " + this.confSvc.sessionId;
    //   console.log(infoLabel);
    //   this.showCallWaitingControls();
    // });
    this.showCallWaitingControls();
  }

  ionViewWillLoad() {
    this.incommingCallerName = '';
    if (!this.fAuth.auth.currentUser) {
      this.navCtrl.setRoot('LoginPage');
    }
  }

  callEstablishedHandler(e) {
    this.showInCallControls();
  }


  incomingCallHandler(e) {
    this.currentCallId = e.detail.callId;
    let callerId = e.detail.callerId;
    let callerName = e.detail.callerNickname;
    if (callerName) {
      this.incommingCallerName = callerName;
    } else if (callerId) {
      this.incommingCallerName = callerId;
    } else {
      this.incommingCallerName = '';
    }

    if (this.currentCallId) {
      this.showIncomingCallControls();
    }
  }

  remoteStreamAddedHandler(e) {
    console.log("remoteStreamAddedHandler", e);
    this.removeChildrenElements('remote');

    this.confSvc.webRTCClient.addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      "remote",
      'remoteElt-' + e.detail.callId,
      { width: "100%", height: "100%" },
      false
    );
    this.currentCallId = e.detail.callId;
    console.log('REMOTE MEDIA ADDED');

  }

  userMediaSuccessHandler(e) {
    console.log("userMediaSuccessHandler", e);
    this.removeChildrenElements('mini');
    this.confSvc.webRTCClient.addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      "mini",
      'miniElt-' + e.detail.callId,
      { width: "100%", height: "100%" },
      true
    );
    this.currentCallId = e.detail.callId;
    console.log('USER MEDIA ADDED');
  }

  userMediaErrorHandler(e) {
    console.log('User Media Error');
    this.confSvc.webRTCClient.hangUp();
    this.showCallWaitingControls();
  }


  removeMediaElements(callId) {
    this.confSvc.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.confSvc.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }


  removeChildrenElements(parentId) {
    let parentElm = document.getElementById(parentId);
    while (parentElm.firstChild) {
      parentElm.removeChild(parentElm.firstChild);
    }
  }


  hangupHandler(e) {
    console.log("hangupHandler");
    this.confSvc.webRTCClient.setUserAcceptOnIncomingCall(true);
    this.removeMediaElements(e.detail.callId);
    this.showCallWaitingControls();
  }

  muteMe() {
    this.muted = !this.muted;
    if (this.muted) {
      console.log('Muted');
    }
    if (!this.muted) {
      console.log('UnMuted');
    }

  }

  reversecamera() {
    console.log('camera changed');
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
            this.removeMediaElements(this.currentCallId);
            this.hangup();
            this.navCtrl.pop().then(() => {
              console.log('Clearing apiRTC');
            })
          }
        }
      ]
    });
    alert.present();

  }

  showCallingControls() {
    this.calling = true;
    this.callReady = false;
    this.inCall = false;
    this.callIncomming = false;
  }
  showInCallControls() {
    console.log('Intialize IN call controls');
    this.callReady = false;
    this.calling = false;
    this.inCall = true;
    this.callIncomming = false;
  }

  showIncomingCallControls() {
    console.log('Intialize incomming call controls');
    this.calling = false;
    this.callReady = false;
    this.inCall = false;
    this.callIncomming = true;
  }

  showCallWaitingControls() {
    console.log('Intialize call ready controls');
    this.callReady = true;
    this.calling = false;
    this.inCall = false;
    this.callIncomming = false;
  }

  call() {   
    var callId = this.confSvc.webRTCClient.call(this.calleeId);
    if (callId != null) {
      console.log(`Calling to: ${this.calleeId}`)
      this.showCallingControls();
      this.currentCallId = callId;
    }
  }
  answer() {   
    this.confSvc.webRTCClient.acceptCall(this.currentCallId);
    this.incommingCallerName = '';
    this.showInCallControls();

  }
  reject() {
    this.confSvc.webRTCClient.refuseCall(this.currentCallId);
    this.confSvc.webRTCClient.setUserAcceptOnIncomingCall(true);
    this.showCallWaitingControls();
  }
  disconnect() {
    this.confSvc.webRTCClient.hangUp(this.currentCallId);
    this.confSvc.webRTCClient.setUserAcceptOnIncomingCall(true);
    this.showCallWaitingControls();
  }
  hangup() {
    this.confSvc.webRTCClient.hangUp(this.currentCallId);
    this.confSvc.webRTCClient.setUserAcceptOnIncomingCall(true);
    this.showCallWaitingControls();
  }


}
