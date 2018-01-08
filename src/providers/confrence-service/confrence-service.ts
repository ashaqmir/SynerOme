import { Events, Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
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

  constructor(
    public events: Events,
    public platform: Platform) {

  }

  initialize(callId): Promise<any> {
    return new Promise(resolve => {
      if (!this.started) {
        if (callId) {

          apiRTC.init({
            apiKey: "819abef1fde1c833e0601ec6dd4a8226",
            apiCCId: callId,
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
            apiKey: "819abef1fde1c833e0601ec6dd4a8226",
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
      //setTimeout(this.refreshVideoView, 2000);
      // setTimeout(function () {
      //   if (this.platform.is('ios')) {
      //     console.log("REFRESH");
      //     iosrtc.refreshVideos();
      //   }
      // }, 2000);
      this.events.publish('incomingCall', evt);
    });

    apiRTC.addEventListener("userMediaError", evt => {
      this.events.publish('userMediaError', evt);
    });

    apiRTC.addEventListener("remoteStreamAdded", evt => {
      this.events.publish('remoteStreamAdded', evt);
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
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);
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