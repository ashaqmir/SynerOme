import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, ModalController,  FabContainer, MenuController } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireAuth } from 'angularfire2/auth';

import { CallControlBoxPage, LoginPage} from '../pages';


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
    private modelCtrl: ModalController,
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
          console.log('User Profile not found');
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
