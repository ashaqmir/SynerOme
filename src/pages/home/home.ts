import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DashboardPage, PreferencesPage, AppointmentsPage, LoginPage } from '../pages';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { AuthanticationServiceProvider } from '../../providers/user-service/authantication-service';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dashboardPage: any = DashboardPage;
  appointmentsPage: any = AppointmentsPage
  preferencePage: any = PreferencesPage;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public appState: AppStateServiceProvider,
    private fDb: AngularFireDatabase) {
  }

  ionViewWillLoad() {
    if (!this.afAuth.auth.currentUser) {
      this.navCtrl.setRoot(LoginPage);
    }
  }
  ionViewDidLoad() {
    //this.navCtrl.popToRoot();
  }
}
