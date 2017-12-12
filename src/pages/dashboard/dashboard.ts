import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, ModalController,  FabContainer, MenuController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { CallControlBoxPage, LoginPage, ProductListPage} from '../pages';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../providers/providers';


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
    private afAuth: AngularFireAuth,
    private modelCtrl: ModalController,
    public modalCtrl: ModalController,    
    private toastCtrl: ToastController,
    private menu: MenuController,
    private authProvider: AuthanticationServiceProvider,    
    private appState: AppStateServiceProvider
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
    this.authProvider.logoutUser()
    .then(authData => {
      console.log("Logged out");
      // toast message
      this.presentToast('bottom', 'You are now logged out');
      this.navCtrl.setRoot(LoginPage);
    }, error => {
      var errorMessage: string = error.message;
      console.log(errorMessage);
    });
  }

  presentToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000
    });
    toast.present();
  }    

  openShoping(){
   this.navCtrl.setRoot(ProductListPage);
  }

  registerKit(){
    console.log('Register Kit'); 
  }
}
