import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages';

@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html'
})
export class PreferencesPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth) {
  }


  ionViewWillLoad() {
    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        //Add adition code for handling setting presistance management
      }
      else {
        console.log('auth false');
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }
}
