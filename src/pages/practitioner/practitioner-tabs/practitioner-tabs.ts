import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, PopoverController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { IProfile } from '../../../models/models';
import { AppStateServiceProvider, ConfrenceServiceProvider } from '../../../providers/providers';
import { LoginPage } from '../../auth/auth';
import {
  PractitionerOptionsPage, PatientsPage,
  PractitionerAppointmentsPage, NotificationPage
} from '../practitioner';

@IonicPage()
@Component({
  selector: 'page-practitioner-tabs',
  templateUrl: 'practitioner-tabs.html'
})
export class PractitionerTabsPage {

  patientsRoot = PatientsPage
  appointmentsRoot = PractitionerAppointmentsPage
  notificationRoot = NotificationPage
  pageContent: any;
  private appState: any;
  private confSvc: any;
  userProfile: IProfile;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    appState: AppStateServiceProvider,
    confService: ConfrenceServiceProvider,
    private toast: ToastController,
    private popoverCtrl: PopoverController) {
    this.appState = appState;
    this.confSvc = confService;
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

            this.confSvc.initialize(this.userProfile.callId, this.userProfile.email).then(data => {
              let infoLabel = "Your local ID : " + this.confSvc.sessionId;
              console.log(infoLabel);
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
    //this.navCtrl.popToRoot();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PractitionerOptionsPage,
      { page: this.pageContent })
    popover.present({
      ev: event
    });
  }


  ionViewCanEnter() {
    if (this.appState.loginState) {
      return this.appState.loginState;
    } else {
      this.navCtrl.setRoot(LoginPage)
    }
  }
}
