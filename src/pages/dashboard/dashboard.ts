import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  userProfile: any;

  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController,
    public appSate: AppStateServiceProvider) {
  }
  
  ionViewWillLoad() {
    this.userProfile=this.appSate.userProfile;
  }
}
