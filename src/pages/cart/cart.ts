import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage, AddressPage, AddressListPage, OrderFinalPage } from '../pages';
import { IProfile, IAddress, IOrder } from '../../models/models';
import { AppStateServiceProvider, AuthanticationServiceProvider } from '../../providers/providers';
import { AngularFireDatabase } from 'angularfire2/database';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';


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
    private authProvider: AuthanticationServiceProvider,
    private payPal: PayPal) {

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
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    //BUIDL ORDER OBJECT
    let order = {} as IOrder;
    order.productReference = `[${this.product.name}][${this.total}][${new Date().toString()}][${this.uid}]`
    order.userMail = this.userProfile.email;
    order.shippingAddress = this.shippingAddress;
    order.price = this.price;
    order.tax = this.tax;
    order.amountPaid = this.total;
    console.log(order);

    //INTIALIZE PAYMENT
    this.payPal.init({
      PayPalEnvironmentProduction: 'AQSJgxlIVgoah4mRdxqTBvfL2ZQqpZj4GoJI3YQy2CqiRW91QmJ8PcAaryFg3Ijk5W7NK47SDz6UuGoI',
      PayPalEnvironmentSandbox: 'AQSJgxlIVgoah4mRdxqTBvfL2ZQqpZj4GoJI3YQy2CqiRW91QmJ8PcAaryFg3Ijk5W7NK47SDz6UuGoI'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      })).then(() => {
        let payment = new PayPalPayment(this.total.toString(), 'USD', order.productReference, 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log('Result from Paypal: ', res);
          if (res && res.response) {
            let resposeString = JSON.stringify(res.response);
            order.payPalStatus = resposeString;
            this.addOrderToDB(order);
            loadingPopup.dismiss();
            this.navCtrl.setRoot(OrderFinalPage, { finalOrder: order, userLastName: this.userProfile.lastName });
          }
        }, (err) => {
          console.log('Error: ', err)
          loadingPopup.dismiss();
        });
      }, (conf) => {
        console.log('Configuration Error: ', conf)
        loadingPopup.dismiss();
      });
    }, (init) => {
      console.log('Init Error: ', init)
      loadingPopup.dismiss();
    });

    //loadingPopup.dismiss();
    //this.navCtrl.setRoot(OrderFinalPage, { finalOrder: order, userLastName: this.userProfile.lastName });
  }

  addOrderToDB(order: IOrder) {
    if (order) {
      let orderList = this.afDb.list('Orders');
      return orderList.push(order)
        .then(res => {
          console.log(res);
        });
    }
  }

  addAddress() {
    let addressModel = this.modelCtrl.create(AddressPage);

    addressModel.onDidDismiss(data => {

      if (data && data.address) {
        this.addAddressToProfile(data.address);
      }

    });

    addressModel.present()

  }

  addAddressToProfile(addressObj) {

    let address = {} as IAddress;

    address = addressObj
    console.log(address);
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

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
        let profSubs = profRef.snapshotChanges().subscribe(profData => {
          this.userProfile = profData.payload.val();
          this.appState.setUserProfile(this.userProfile);

          this.events.publish('profile:recieved', this.userProfile);

          this.userProfile = this.appState.getUserProfile()

          profSubs.unsubscribe();

          if (this.userProfile) {
            console.log('Shout out again');
            if (this.userProfile.Addresses) {

              if (this.userProfile.Addresses.length == 1) {
                this.shippingAddress = this.userProfile.Addresses[0];
              } else {
                this.shippingAddress = this.userProfile.Addresses.find(adr => adr.isDefault)
              }
              this.enableBuy = true;
            }
          }

          loadingPopup.dismiss()
          //this.navCtrl.push(CartPage, { selectedProduct: this.product });
        });

      })
      .catch(error => {
        console.log(error);
        loadingPopup.dismiss()
      })

  }

  changeAddress() {
    if (this.userProfile && this.userProfile.Addresses) {
      if (this.userProfile.Addresses.length > 1) {
        let addressModel = this.modelCtrl.create(AddressListPage, { addressList: this.userProfile.Addresses });

        addressModel.onDidDismiss(data => {

          if (data && data.address) {
            this.shippingAddress = data.address;
          }

        });

        addressModel.present()
      }
    }
  }
}
