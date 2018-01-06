import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PractitionerOptionsPage } from '../practitioner';
import {  AppStateServiceProvider } from '../../../providers/providers';

import { LoginPage } from '../../auth/auth';


@IonicPage()
@Component({
  selector: 'page-patients',
  templateUrl: 'patients.html',
})
export class PatientsPage {
  pageContent: any;
  private appState: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    appState: AppStateServiceProvider, ) {
    this.appState = appState;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientsPage');
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
