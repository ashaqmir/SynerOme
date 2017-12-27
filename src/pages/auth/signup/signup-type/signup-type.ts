import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConsumerSignupPage, PractitionerSignupPage } from '../../../pages';

@IonicPage()
@Component({
  selector: 'page-signup-type',
  templateUrl: 'signup-type.html',
})
export class SignupTypePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupTypePage');
  }

  gotoConsumerSignup() {
    this.navCtrl.push(ConsumerSignupPage);
  }
  gotoPractitionerSignup() {
    this.navCtrl.push(PractitionerSignupPage);
  }
}
