import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppStateServiceProvider } from '../../../providers/app-state-service/app-state-service';
import { HomePage } from '../../pages';
//import { NativeAudio } from '@ionic-native/native-audio';

declare var apiRTC: any

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

  webRTCClient;

  incomingCallId: string = '';
  myCallId;
  status;
  outgoingCalleeId: string = '';

  muted: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fAuth: AngularFireAuth,
    public appState: AppStateServiceProvider,
    private alertCtrl: AlertController
    //private nativeAudio: NativeAudio
  ) {
    this.incomingCallId = this.navParams.get('callToId');
    this.outgoingCalleeId = this.navParams.get('callFromId');



    if (this.fAuth.auth.currentUser) {
      //var proccessing = false;
      // if (this.incomingCallId && proccessing) {
      //   proccessing = true;
      //   console.log('Answering..');
      //   this.answerCall(this.incomingCallId);
      // }

      // if (this.outgoingCalleeId && proccessing) {
      //   proccessing = true;
      //   console.log('Calling..');
      //   this.makeCall(this.outgoingCalleeId);
      // }
    } else {
      this.navCtrl.setRoot('LoginPage');
    }
  }


  InitializeApiRTC() {
    if (this.fAuth.auth.currentUser) {
      this.myCallId = this.fAuth.auth.currentUser.uid;
      apiRTC.init({
        apiKey: "819abef1fde1c833e0601ec6dd4a8226",
        apiCCId: this.outgoingCalleeId,
        onReady: (e) => {
          this.sessionReadyHandler(e);
        }
      });

    }
  }


  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;
    console.log('my Call id:' + this.myCallId);
    this.AddEventListeners();
    this.InitializeWebRTCClient();
  }

  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });

  }


  AddEventListeners() {
    
    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");

      this.webRTCClient.setAllowMultipleCalls(false);
      this.webRTCClient.setVideoBandwidth(600);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);

      this.IntializeCallControls()
    });

    apiRTC.addEventListener("userMediaSuccess", (e) => {
      this.showStatus = true;

      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "boxOutgoing", 'boxOutgoing-' + e.detail.callId, {
        width: "100%",
        height: "100%"
      }, true);

    });

    apiRTC.addEventListener("userMediaError", (e) => {
      this.IntializeCallControls();
      this.status = this.status + "<br/> The following error has occurred <br/> " + e;
    });

    apiRTC.addEventListener("incomingCall", (e) => {
      this.InitializeControlsForIncomingCall();
      this.incomingCallId = e.detail.callId;
    });

    apiRTC.addEventListener("hangup", (e) => {
      if (e.detail.lastEstablishedCall === true) {

        this.IntializeCallControls();
      }
      this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
      this.RemoveMediaElements(e.detail.callId);
    });

    apiRTC.addEventListener("remoteStreamAdded", (e) => {
      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "boxIncomming", 'boxIncomming-' + e.detail.callId, {
        width: "100%",
        height: "100%"
      }, true);

    });
  }


  ionViewDidLoad() {

    this.InitializeApiRTC();

    console.log('inComming:' + this.incomingCallId);
    console.log('outGoing:' + this.outgoingCalleeId);
  }

  ionViewWillLoad() {
    if (!this.fAuth.auth.currentUser) {
      this.navCtrl.setRoot('LoginPage');
    }
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



  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('boxOutgoing', 'boxOutgoing-' + callId);
    this.webRTCClient.removeElementFromDiv('boxIncomming', 'boxIncomming-' + callId);
  }

  makeCall(calleeId) {
    var callId = this.webRTCClient.call(calleeId);
    if (callId != null) {
      //this.incomingCallId = callId;
      this.IntializeInCallControls();
    }
  }

  call() {
    console.log('calling to:' + this.incomingCallId);
    this.makeCall(this.incomingCallId);
  }

  hangup() {
    this.disconnect(this.incomingCallId);

  }

  answerIncommingCall() {
    this.answerCall(this.incomingCallId);
  }

  answerCall(incomingCallId) {
    if (this.webRTCClient) {
      this.webRTCClient.acceptCall(incomingCallId);
    }
    // // this.nativeAudio.stop('uniqueI1').then(() => { }, () => { });

    this.IntializeInCallControls();
  }

  disconnect(incomingCallId) {

    if (this.webRTCClient) {
      this.webRTCClient.hangUp();
    }
    // this.confProvider.confrenceClient.refuseCall(incomingCallId);
    // //this.UpdateControlsOnReject();
    this.RemoveMediaElements(incomingCallId);
    this.IntializeCallControls();
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
            this.hangup();
            apiRTC.disconnect();
            this.navCtrl.setRoot(HomePage)

          }
        }
      ]
    });
    alert.present();

  }
  IntializeInCallControls() {
    this.showCall = false;
    this.showIncomming = false;
    this.showInCall = true;
  }

  InitializeControlsForIncomingCall() {
    this.showIncomming = true;
    this.showCall = false;
    this.showInCall = false;
  }


  IntializeCallControls() {
    this.showCall = true;
    this.showInCall = false;
    this.showIncomming = false;
  }


  AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
    let mediaElt = null;
    let divElement = null;

    if (callType === 'audio') {
      mediaElt = document.createElement("audio");
    } else {
      mediaElt = document.createElement("video");
    }

    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);

    this.webRTCClient.attachMediaStream(mediaElt, stream);
  }



}
