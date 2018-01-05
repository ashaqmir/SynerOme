import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { UserOptionsPage } from '../../consumer/consumer';



@IonicPage()
@Component({
  selector: 'page-practitioner-dashboard',
  templateUrl: 'practitioner-dashboard.html',
})
export class PractitionerDashboardPage {
  pageContent: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,  
    private popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PractitionerDashboardPage');
  }


  presentPopover(event) {
    let popover = this.popoverCtrl.create(UserOptionsPage,
      { page: this.pageContent })
    popover.present({
      ev: event
    });
  }
}
