import { Events, Platform,  ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ConfrencePage } from '../../pages/shared/shared';
import { AppStateServiceProvider } from '../providers';
// import { AngularFireAuth } from 'angularfire2/auth';
//import { NativeAudio } from '@ionic-native/native-audio';

declare var iosrtc;
declare var apiRTC;
declare var apiCC;

@Injectable()
export class ConfrenceServiceProvider {
  webRTCClient: any;
  sessionId: any;
  started: boolean = false;
  myCallId: string;

  private appState: any;

  constructor(
    public events: Events,
    public modalCtrl: ModalController,
    appState: AppStateServiceProvider,
    public platform: Platform) {
    this.appState = appState;
    this.refreshVideoView = this.refreshVideoView.bind(this);
  }

  initialize(callId, userName): Promise<any> {
    this.myCallId = callId;
    return new Promise(resolve => {
      if (!this.started) {
        if (callId) {

          apiRTC.init({
            apiKey: "e73c57ca525fb5f2977abe22bf4a68a2",
            apiCCId: callId,
            nickname: userName,
            onReady: (e) => {
              this.sessionReadyHandler(e);
              this.webRTCClient = apiCC.session.createWebRTCClient({});
              this.sessionId = apiCC.session.apiCCId;
              this.started = true;
              console.log(this.sessionId);
              console.log(this.webRTCClient)
              return resolve('started!');
            }
          });
        } else {
          apiRTC.init({
            apiKey: "e73c57ca525fb5f2977abe22bf4a68a2",
            onReady: (e) => {
              this.sessionReadyHandler(e);
              this.webRTCClient = apiCC.session.createWebRTCClient({});
              this.sessionId = apiCC.session.apiCCId;
              this.started = true;
              console.log(this.sessionId);
              console.log(this.webRTCClient)
              return resolve('started!');
            }
          });
        }
      } else if (this.started && !this.webRTCClient) {
        this.webRTCClient = apiCC.session.createWebRTCClient({});
        this.sessionId = apiCC.session.apiCCId;
        return resolve('created!');
      } else {

        return resolve('already started!');
      }


    });

  }

  sessionReadyHandler(e) {
    console.log('Settingup Handlers');
    console.log("sessionReadyHandler");

    apiRTC.addEventListener("incomingCall", evt => {
    
      console.log('incoming.....');
      if (this.appState.currentView === 'confrence') {
        this.events.publish('incomingCall', evt);
      } else {
        let callerId = evt.detail.callerId;
        let modal = this.modalCtrl.create(ConfrencePage,
          {
            callToId: callerId,
            callFromId: this.myCallId
          });
        modal.present().then(data => {
          this.events.publish('incomingCall', evt);
          setTimeout(this.refreshVideoView, 2000);
        })
      }

    });

    apiRTC.addEventListener("callEstablished", evt => {
    
      console.log('established.....');
      this.events.publish('callEstablished', evt);
      setTimeout(this.refreshVideoView, 4000);

    });

    apiRTC.addEventListener("userMediaError", evt => {
      this.events.publish('userMediaError', evt);
    });

    apiRTC.addEventListener("callEstablished", evt => {
      this.events.publish('callEstablished', evt);
    });

    apiRTC.addEventListener("remoteHangup", evt => {
      this.events.publish('remoteHangup', evt);
    });
    apiRTC.addEventListener("remoteStreamAdded", evt => {
      this.events.publish('remoteStreamAdded', evt);
      setTimeout(this.refreshVideoView, 100);
    });

    apiRTC.addEventListener("userMediaSuccess", evt => {
      this.events.publish('userMediaSuccess', evt);
    });

    apiRTC.addEventListener("hangup", evt => {
      if (!this.webRTCClient) {
        this.webRTCClient.hangUp();
      }
      this.events.publish('hangup', evt);
    });

    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(false);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(false);
      //this.webRTCClient.UserAcceptOnIncomingDataCall(false);
    });
  }

  refreshVideoView() {
    if (this.platform.is('ios')) {
      console.log("REFRESH");
      iosrtc.refreshVideos();
    }
  }

  tango() {
    console.log('Tango Called');
    this.events.publish('tango', { message: this.sessionId });
  }

  isUserConnected(uId): string {
    console.log(`Check id: ${uId}`);
    let userInfo = '';
    //let tet = apiCC.session.getConnectedUserInfo(userId, userInfo);
    let tet = apiCC.session.getConnectedUserInfo(uId, 'all');
    console.log(tet);

    let tempo = apiCC.session.getConnectedUserIdsList();
    console.log(tempo);
    console.log(apiCC.session.isConnectedUser(uId))
    return userInfo;
    //isConnectedUser()
  }
}