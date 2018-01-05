import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-consumer-tabs',
  templateUrl: 'consumer-tabs.html'
})
export class ConsumerTabsPage {

  homeRoot = 'HomePage'
  myHealthRoot = 'MyHealthPage'
  genesRoot = 'GenesPage'
  snpRoot = 'SnpPage'


  constructor(public navCtrl: NavController) {}

}
