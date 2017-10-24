import { IFacetimeRequest } from './../../../models/facetimeRequest';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppStateServiceProvider } from '../../../providers/app-state-service/app-state-service';

declare var VC: any

@IonicPage()
@Component({
  selector: 'page-confrence',
  templateUrl: 'confrence.html',
})

export class ConfrencePage {
  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;

  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private fDb: AngularFireDatabase,
    public appState: AppStateServiceProvider,
    private toast: ToastController, ) {
    }
  ionViewDidLoad() {

  }
}
