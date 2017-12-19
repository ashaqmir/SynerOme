import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DashboardPage, PreferencesPage, AppointmentsPage, LoginPage } from '../pages';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dashboardPage: any = DashboardPage;
  appointmentsPage: any = AppointmentsPage
  preferencePage: any = PreferencesPage;
  uid: any;
  email: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth) {
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
