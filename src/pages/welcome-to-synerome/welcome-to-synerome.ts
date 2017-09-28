import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DNADataPage } from '../dnadata/dnadata';

@Component({
  selector: 'page-welcome-to-synerome',
  templateUrl: 'welcome-to-synerome.html'
})
export class WelcomeToSynerOmePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController) {
  }
  goToDNADATA(params){
    if (!params) params = {};
    this.navCtrl.push(DNADataPage);
  }
}
