import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-callControlBox',
  templateUrl: 'callControlBox.html',
})

export class CallControlBoxPage {

  callerId: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private app: App,) {
      this.callerId= this.navParams.get('incommingCallerId');
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  accept(){   
    this.app.getRootNav().setRoot('ConfrencePage', { incommingCallerId: this.callerId, outCallToId: '' });
    this.dismiss();
  }
  ionViewDidLoad() {

  }

  ionViewWillLoad() {

  }

}
