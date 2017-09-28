import { WelcomeToSynerOmePage } from './../welcome-to-synerome/welcome-to-synerome';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController) {
  }
  
  signUp(){
    this.navCtrl.setRoot(WelcomeToSynerOmePage);
  }
}
