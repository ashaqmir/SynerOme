import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage, AddressPage } from '../pages';
import { IProfile, IAddress } from '../../models/models';
import { AppStateServiceProvider, AuthanticationServiceProvider } from '../../providers/providers';
import { AngularFireDatabase } from 'angularfire2/database';



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
  uid: string;
  userProfile: IProfile;
  enableBuy: boolean = false;
  shippingAddress: IAddress;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private loadingCtrl: LoadingController,
    public modelCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private appState: AppStateServiceProvider,
    private authProvider: AuthanticationServiceProvider) {

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
        this.uid = userAuth.uid;
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

            if (this.userProfile.Addresses.length == 1) {
              this.shippingAddress = this.userProfile.Addresses[0];
            } else {
              this.shippingAddress = this.userProfile.Addresses.find(adr => adr.isDefault)
            }
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
    let addresModel = this.modelCtrl.create(AddressPage);

    addresModel.onDidDismiss(data => {
     
      if (data && data.address) {
        this.addAddressToProfile(data.address);
      }

    });

    addresModel.present()

  }

  addAddressToProfile(addressObj) {

    let address = {} as IAddress;

    address = addressObj
    console.log(address);
    // let loadingPopup = this.loadingCtrl.create({
    //   spinner: 'crescent',
    //   content: ''
    // });
    // loadingPopup.present();

    if (!this.userProfile.Addresses) {
      this.userProfile.Addresses = [] as IAddress[];
    }
    if (address.isDefault) {
      this.userProfile.Addresses.forEach(adr => {
        adr.isDefault = false
      });
    }

    this.userProfile.Addresses.push(address);
    this.authProvider.updateUserProfile(this.userProfile, this.uid)
      .then(profDate => {
        const profRef = this.afDb.object('/profiles/' + this.uid);
        profRef.snapshotChanges().subscribe(profData => {
          this.userProfile = profData.payload.val();
          this.appState.setUserProfile(this.userProfile);

          this.events.publish('profile:recieved', this.appState.userProfile);
          //loadingPopup.dismiss()
        });

      })
      .catch(error => {
        console.log(error);
        //loadingPopup.dismiss()
      })
  }
}
