import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
//import { NativeAudio } from '@ionic-native/native-audio';

declare var apiRTC: any

@Injectable()
export class ConfrenceServiceProvider {

  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  myCallId: string = '';
  session;
  confrenceClient;
  incomingCallId = 0;
  incomingCall: boolean = false;
  status;
  calleeId;
  mydevices: any[] = [];
  currentDevice: any;


  constructor(public http: Http,
    private fAuth: AngularFireAuth,
  ) {

    if (!this.fAuth.auth.currentUser) {
      console.log('Log logged in...')
    } else {

      this.myCallId = this.fAuth.auth.currentUser.uid;
    }
    //this.InitializeApiRTC()

  }

  //Instialize webRTC
  InitializeApiRTC() {
    if (this.fAuth.auth.currentUser) {
      this.myCallId = this.fAuth.auth.currentUser.uid;
      apiRTC.init({
        apiKey: "819abef1fde1c833e0601ec6dd4a8226",
        apiCCId: this.myCallId,
        onReady: (e) => {
          this.sessionReadyHandler(e);
        }
      });

    }
  }


  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;    
    this.InitializeWebRTCClient();
    this.AddEventListeners();
  }

  InitializeWebRTCClient() {
    this.confrenceClient = apiRTC.session.createWebRTCClient({
      status: "status"
    });

  }

  AddEventListeners() {
    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.confrenceClient.setAllowMultipleCalls(false);
      this.confrenceClient.setVideoBandwidth(300);
      this.confrenceClient.setUserAcceptOnIncomingCall(true);


      this.confrenceClient.getMediaDevices((info) => {
        if (info) {
          info.forEach(element => {
            if (element.kind == 'videoinput') {
              this.mydevices.push(element);
            }
          });
        }
      });

      console.log(this.mydevices);
    });


  }
}