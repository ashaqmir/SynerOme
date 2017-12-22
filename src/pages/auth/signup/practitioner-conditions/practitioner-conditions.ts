import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-practitioner-conditions',
  templateUrl: 'practitioner-conditions.html',
})
export class PractitionerConditionsPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PractitionerConditionsPage');
  }
  
  accept(){
    let data = { 'condition': 'accept' };
    this.viewCtrl.dismiss(data);
  }

  reject(){
    let data = { 'condition': 'reject' };
    this.viewCtrl.dismiss(data);
  }
}
