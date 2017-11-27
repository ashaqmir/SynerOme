import { Observable } from 'rxjs/Observable';
import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, App, FabContainer, MenuController } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IFacetimeRequestView } from '../../models/models';
import { ConfrenceServiceProvider } from '../../providers/confrence-service/confrence-service';


import { IFacetimeRequest } from './../../models/facetimeRequest';
import { CallControlBoxPage, LoginPage, ConfrencePage, UserListPage, DemographicPage } from '../pages';


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
    private appState: AppStateServiceProvider,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private modelCtrl: ModalController,
    private app: App,
    public modalCtrl: ModalController,
    private menu: MenuController
  ) {

  }

  ionViewWillLoad() {
    
    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        if (this.appState.userProfile) {
          this.userProfile = this.appState.getUserProfile();
        } else {
          console.log('auth false');
          this.navCtrl.setRoot(LoginPage);
        }
      }
      else {
        console.log('auth false');
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ionViewDidLoad(){
    this.menu.enable(true);
  }


  openModel(pageName, userList) {
    this.modelCtrl.create(pageName, null, { cssClass: 'inset-modal' })
      .present();
  }
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
