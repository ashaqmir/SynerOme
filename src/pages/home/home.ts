import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, FabContainer } from 'ionic-angular';
import { DashboardPage, PreferencesPage } from '../pages';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { AuthanticationServiceProvider } from '../../providers/user-service/authantication-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  dashboardPage: any = DashboardPage;
  preferencePage: any = PreferencesPage;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private authService: AuthanticationServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.uid) {
        this.toast.create({
          message: `Welcome to APP_NAME, ${data.email}`,
          duration: 3000
        }).present();
      } else {
        console.log(data)
        this.navCtrl.setRoot('WelcomePage');
      }
    });
  }

  signOut(fab: FabContainer) {
    fab.close();
    this.authService.logout()
      .then(data => {
        this.navCtrl.setRoot('WelcomePage')
      })
      .catch(error => {
        console.log(error);
      })
  }
}
