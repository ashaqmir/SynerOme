import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AuthanticationServiceProvider } from '../../providers/providers';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages';


@IonicPage()
@Component({
  selector: 'page-register-kit',
  templateUrl: 'register-kit.html',
})
export class RegisterKitPage {

  barcode: string;
  uid: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private authProvider: AuthanticationServiceProvider,
    private afAuth: AngularFireAuth, ) {
  }

  ionViewWillLoad() {

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
    let removePop = true;

    try {
      this.afAuth.authState.subscribe(userAuth => {
        if (userAuth) {
          this.uid = userAuth.uid;
          if (removePop) {
            loadingPopup.dismiss()
            removePop = false;
          }
        }
        else {
          console.log('auth false');
          if (removePop) {
            loadingPopup.dismiss()
            removePop = false;
          }
          this.navCtrl.setRoot(LoginPage);
        }
      });
    } catch (error) {
      if (removePop) {
        loadingPopup.dismiss()
        removePop = false;
      }
      this.toast.create({
        message: error.message,
        duration: 3000
      }).present();
    }
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
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
    let removePop = true;
    this.authProvider.addUserKit(this.uid, this.barcode);
    if (removePop) {
      loadingPopup.dismiss()
      removePop = false;
      this.navCtrl.popToRoot();
    }
  }
}
