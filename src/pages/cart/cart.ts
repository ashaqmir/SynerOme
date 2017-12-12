import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage, AddressPage } from '../pages';
import { IProfile, IAddress } from '../../models/models';
import { AppStateServiceProvider } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  product: any;
  processed: boolean = true;
  price: number;
  tax: number;
  total: number;
  currency: string;
  userProfile: IProfile;
  enableBuy: boolean = false;
  shippingAddress: IAddress;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public modelCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private appState: AppStateServiceProvider) {

    this.product = this.navParams.get('selectedProduct');
  }

  ionViewWillLoad() {

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.userProfile = this.appState.getUserProfile()
        console.log(this.userProfile);
        if (this.product) {
          this.price = this.product.price;
    
          var tax = 0;
          if (this.product.taxPer) {
            tax = this.product.taxPer;
          }
    
          this.tax = this.price * tax;
          this.total = this.price + this.tax;
          this.currency = this.product.currency;
          this.processed = true;
    
        }
        if (this.userProfile) {
          console.log('Shout out');
          if (this.userProfile.Addresses) {
           
            
            this.shippingAddress = this.userProfile.Addresses.find(adr => adr.type == 'shipping')
            this.enableBuy = true;
          }
        }
        loadingPopup.dismiss();
      }
      else {
        console.log('auth false');
        loadingPopup.dismiss();
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ionViewDidLoad() {
   
  }


  purchase() {
    console.log('Purchase')
  }


  addAddress() {
    this.modelCtrl.create(AddressPage)
      .present();
  }
}
