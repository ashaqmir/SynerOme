import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ConsumerDashboardPage, CartPage } from '../consumer';
import { LoginPage } from '../../auth/auth';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private socialSharing: SocialSharing) {

  }


  ionViewWillLoad() {

    this.product = this.navParams.get('selectedProduct');
    console.log(this.product);
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    let removePop: boolean = true;
    loadingPopup.present();

    if (!this.product) {
      let productName = this.navParams.get('prodName');
      if (productName) {

        //LOAD Product from DB
        this.afDb.list('/products', ref => ref.orderByChild('BRONZE').equalTo(productName)).valueChanges()
          .subscribe(items => {
            this.product = items[0];
            //console.log(this.products);
            if (removePop) {
              loadingPopup.dismiss()
              removePop = false;
            }
          });
        if (removePop) {
          loadingPopup.dismiss()
          removePop = false;
        }
      }
      else {
        this.afAuth.authState.subscribe(userAuth => {
          if (userAuth) {
            this.navCtrl.setRoot(ConsumerDashboardPage)
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
      }
    }
    else {
      if (removePop) {
        loadingPopup.dismiss()
        removePop = false;
      }
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart() {
    console.log('Add to cart.');
    this.navCtrl.push(CartPage, { selectedProduct: this.product });
  }

  shareByWhatsApp() {
    // this.socialSharing.canShareVia('whatsapp').then(() => {
    this.socialSharing.shareViaWhatsApp('Check this out:  SynerOme://product-details/' + this.product.name,
      null, null).then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
    // }).catch((error) => {
    //   console.log(error);
    // });
  }
  shareByTwitter() {
    console.log('Twitter');
  }
  shareByFacebook() {
    console.log('FACEBOOK');
  }

  goBack(){
    this.navCtrl.pop();
  }
}
