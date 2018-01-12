import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-callControlBox',
  templateUrl: 'callControlBox.html',
})

export class CallControlBoxPage {

  callerId: string = '';
  callerName: string = '';
  result: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.callerId = this.navParams.get('callerId');
    this.callerName = this.navParams.get('callerName');

  }


  reject() {
    this.result = 'rejected'
    this.dismiss();
  }

  accept() {
    this.result = 'accepted'
    this.dismiss();
  }

  dismiss() {
    let data = { 'result': this.result };
    this.viewCtrl.dismiss(data);
  }
  ionViewDidLoad() {

  }

  ionViewWillLoad() {

  }

}
