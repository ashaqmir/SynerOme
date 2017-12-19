import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, ModalController, FabContainer, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { CallControlBoxPage, LoginPage, ProductListPage } from '../pages';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../providers/providers';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  userProfile: IProfile;
  myCallerId: number = 0;

  incomingCallId;
  incomingCall: boolean = false;

  showQuickActions: boolean = true;
  showWaitingMessage: boolean = false;

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private modelCtrl: ModalController,
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private toastCtrl: ToastController,
    private menu: MenuController,
    private authProvider: AuthanticationServiceProvider,
    private appState: AppStateServiceProvider
  ) {

  }

  ionViewWillLoad() {

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
    let removePop = true;

    try {
      this.afAuth.authState.subscribe(userAuth => {
        if (userAuth) {
          if (this.appState.userProfile) {
            this.userProfile = this.appState.getUserProfile();
            const orderRef = this.afDb.list('/Orders/', ref => ref.orderByChild('userMail').equalTo(userAuth.email)).valueChanges();
            orderRef.subscribe(orderData => {             
              if (orderData) {
                this.appState.userOrders = orderData;
                console.log(orderData);
              }
              if (this.appState.userOrders && this.appState.userOrders.length >= 1) {             
                this.showQuickActions = false;
                this.showWaitingMessage = true;
              }
              if (removePop) {
                loadingPopup.dismiss()
                removePop = false;
              }
            });
            if (removePop) {
              loadingPopup.dismiss()
              removePop = false;
            }
          } else {
            console.log('User Profile not found');
            if (removePop) {
              loadingPopup.dismiss()
              removePop = false;
            }
            this.navCtrl.setRoot(LoginPage);
          }
        }
        else {
          console.log('auth false');
          if (removePop) {
            loadingPopup.dismiss()
            removePop = false;
          }
          this.navCtrl.setRoot(LoginPage);
        }
      });

    } catch (error) {
      if (removePop) {
        loadingPopup.dismiss()
        removePop = false;
      }
      this.toast.create({
        message: error.message,
        duration: 3000
      }).present();
    }

  }

  ionViewDidLoad() {
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

  openShoping() {
    this.navCtrl.setRoot(ProductListPage);
  }

  registerKit() {
    console.log('Register Kit');
  }
}
