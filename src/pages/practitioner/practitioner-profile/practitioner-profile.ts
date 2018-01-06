import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { AuthanticationServiceProvider, AppStateServiceProvider, ImageProvider } from '../../../providers/providers';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { IProfile } from '../../../models/models';
import { LoginPage } from '../../auth/auth';

@IonicPage()
@Component({
  selector: 'page-practitioner-profile',
  templateUrl: 'practitioner-profile.html'
})
export class PractitionerProfilePage {


  profilePicture: any = "./assets/imgs/chatterplace.png"
  userProfile: IProfile;
  email: any;
  profileChanged: boolean = false;
  private appState: any;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    appState: AppStateServiceProvider,
    public afAuth: AngularFireAuth,
    public afDb: AngularFireDatabase,
    public authProvider: AuthanticationServiceProvider,
    public imgProvider: ImageProvider
  ) {
    this.appState = appState;
  }
  ionViewWillLoad() {

    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.email = this.afAuth.auth.currentUser.email;
        if (this.appState.userProfile) {
          this.userProfile = this.appState.userProfile;
          if (this.userProfile && this.userProfile.profilePicUrl) {
            this.profilePicture = this.userProfile.profilePicUrl;
          }
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

  showImageOption() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select source',
      buttons: [
        {
          text: 'Image Gallery',
          icon: 'images',
          handler: () => {
            this.changeImage('lib');
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.changeImage('cam');
          }
        }
      ]
    });
    actionSheet.present();
  }


  changeImage(sourceType) {
    console.log('Change Image');
    this.imgProvider.selectImage(sourceType).then(imgData => {
      if (imgData) {
        this.profilePicture = imgData;
        this.profileChanged = true;
      }
    }).catch(error => {
      console.log(error);
    })
  }

  saveProfileImage() {
    if (this.profilePicture) {
      this.authProvider.uploadImage(this.profilePicture, this.userProfile.id);
      this.profileChanged = false;
    }
  }


  ionViewCanEnter() {
    if (this.appState.loginState) {
      return this.appState.loginState;
    } else {
      this.navCtrl.setRoot(LoginPage)
    }
  }
}
