import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../providers/providers';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages';
import { IProfile } from '../../models/models';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {


  profilePicture: any = "https://www.gravatar.com/avatar/"
  userProfile: IProfile;
  email: any;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private appState: AppStateServiceProvider,
    public afAuth: AngularFireAuth,
    public afDb: AngularFireDatabase,
    public authProvider: AuthanticationServiceProvider) {

  }
  ionViewWillLoad() {

    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.email = this.afAuth.auth.currentUser.email;
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

  logout() {
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

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

  presentToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000
    });
    toast.present();
  }

}
