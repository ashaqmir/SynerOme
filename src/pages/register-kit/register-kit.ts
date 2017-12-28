import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-register-kit',
  templateUrl: 'register-kit.html',
})
export class RegisterKitPage {

  barcode: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterKitPage');
  }

  scanBarcode() {

    // let scanOption: BarcodeScannerOptions = {

    // }
    this.barcodeScanner.scan()
      .then((barcodeData) => {
        console.log(barcodeData.text);
        this.barcode = barcodeData.text;
      }).catch(error => {
        console.log(error);
      })
  }

  registerBarcode() {
    console.log(this.barcode);
  }
}
