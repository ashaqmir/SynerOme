import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, ModalController, FabContainer, MenuController, ToastController, LoadingController, PopoverController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { CallControlBoxPage, LoginPage, ProductListPage, RegisterKitPage, UserOptionsPage } from '../pages';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../providers/providers';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  pageContent: any;
  userProfile: IProfile;
  userOrders: any[];
  userKits: any;
  myCallerId: number = 0;

  private appState: any;

  incomingCallId;
  incomingCall: boolean = false;


  showRegisterKit: boolean = false;
  showBuyOption: boolean = true;
  showWaitingMessage: boolean = false;

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private toastCtrl: ToastController,
    private menu: MenuController,
    private authProvider: AuthanticationServiceProvider,
    appState: AppStateServiceProvider,
    private popoverCtrl: PopoverController
  ) {
    this.appState = appState;
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
            this.userProfile = this.appState.userProfile;
            this.userOrders = this.appState.userOrders;
            this.userKits = this.appState.userKits;

            if (this.userOrders.length > 0) {
              this.showRegisterKit = true;
              this.showBuyOption = false;
              this.showWaitingMessage = false;
            }
            if (this.userKits) {
              this.showRegisterKit = false;
              this.showWaitingMessage = true;
              this.showBuyOption = true;
            }

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
    this.modalCtrl.create(pageName, null, { cssClass: 'inset-modal' })
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
    this.navCtrl.push(ProductListPage);
  }

  registerKit() {
    this.navCtrl.push(RegisterKitPage)
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(UserOptionsPage,
      { page: this.pageContent })
    popover.present({
      ev: event
    });
  }
}
