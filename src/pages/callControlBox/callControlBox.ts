import { IFacetimeRequest } from '../../models/facetimeRequest';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController, App } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { HomePage } from '../pages';


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
