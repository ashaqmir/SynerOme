import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PreferencesPage } from '../preferences/preferences';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'landing',
  templateUrl: 'landing.html'
})
export class LandingPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  dashboardPage: any = DashboardPage;
  preferencePage: any = PreferencesPage;
  constructor(public navCtrl: NavController) {
  }
  goToPreferences(params){
    if (!params) params = {};
    this.navCtrl.push(PreferencesPage);
  }
}
