import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, FabContainer } from 'ionic-angular';
import { DashboardPage, PreferencesPage } from '../pages';
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
  preferencePage: any = PreferencesPage;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public appState: AppStateServiceProvider,
    private fDb: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillLoad() {
    // this.afAuth.authState.take(1).subscribe(data => {
    //   if (data && data.uid) {
    //     const profRef = this.fDb.database.ref(`profiles/${data.uid}`);

    //     profRef.on('value', profSnap => {
    //       console.log(profSnap.val());
    //       this.appState.userProfile = profSnap.val();
    //       console.log('profile recived');
    //       console.log(this.appState.userProfile);
    //     });

    //     this.toast.create({
    //       message: `Welcome to APP_NAME, ${data.email}`,
    //       duration: 3000
    //     }).present();
    //   } else {
    //     console.log(data)
    //     this.navCtrl.setRoot('WelcomePage');
    //   }
    // });
  }

  signOut(fab: FabContainer) {
    fab.close();
    this.afAuth.auth.signOut()
      .then(data => {
        this.navCtrl.setRoot('WelcomePage')
      })
      .catch(error => {
        console.log(error);
      })
  }
}
