import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import { IProfile, IAddress, IOrder } from '../../../models/models';
import { AppStateServiceProvider, AuthanticationServiceProvider } from '../../../providers/providers';
import { AngularFireDatabase } from 'angularfire2/database';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { LoginPage } from '../../auth/auth';
import { OrderFinalPage, AddressPage, AddressListPage } from '../consumer';


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
  kitFor: string = 'me';
  kitUserInfo: any;

  kitForForm: FormGroup;
  private appState: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public modelCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    appState: AppStateServiceProvider,
    private authProvider: AuthanticationServiceProvider,
    private payPal: PayPal) {

    this.appState = appState;

    this.product = this.navParams.get('selectedProduct');
    this.kitUserInfo = {
      firstName: '',
      lastName: '',
      dob: '',
    }
    this.createForm();

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
        this.userProfile = this.appState.userProfile
        console.log(this.userProfile);
        if (this.product) {
          this.price = this.product.price;

          var tax = 0;
          if (this.product.taxPer) {
            tax = this.product.taxPer;
          }

          this.tax = this.price * tax;
          this.total = +this.price + +this.tax;
          this.currency = this.product.currency;
          this.processed = true;
          console.log(this.total);
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


  purchase(kitForValues) {
    if (kitForValues) {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();
     
      this.kitUserInfo.firstName = kitForValues.firstName;
      this.kitUserInfo.lastName = kitForValues.lastName;
      this.kitUserInfo.dob = kitForValues.dob;
    
      //BUIDL ORDER OBJECT
      let order = {} as IOrder;
      order.productReference = `[${this.product.name}][${this.total}][${new Date().toString()}]`
      order.userMail = this.userProfile.email;
      order.userID = this.userProfile.id
      order.shippingAddress = this.shippingAddress;
      order.price = this.price;
      order.tax = this.tax;
      order.amountPaid = this.total;
      order.fullfilled = false;
      order.kitFor = this.kitUserInfo;

      console.log(order);
      
      if (order) {
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
      }
    }
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
          this.appState.userProfile = this.userProfile;

          this.events.publish('profile:recieved', this.userProfile);

          this.userProfile = this.appState.userProfile;

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

  kitForOptionChange() {
    console.log('option changed');
    if (this.kitFor === 'me') {
      // this.appState.userProfile.
      this.kitForForm.get('firstName').setValue(this.appState.userProfile.firstName);
      this.kitForForm.get('lastName').setValue(this.appState.userProfile.lastName);
      this.kitForForm.get('dob').setValue(this.appState.userProfile.dob);
    } else if (this.kitFor === 'other') {
      this.kitForForm.get('firstName').setValue('');
      this.kitForForm.get('lastName').setValue('');
      this.kitForForm.get('dob').setValue('');
    }
  }

  createForm() {
    console.log('creating kit form form');
    this.kitForForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
    });

    this.kitForForm.get('firstName').setValue(this.appState.userProfile.firstName);
    this.kitForForm.get('lastName').setValue(this.appState.userProfile.lastName);
    this.kitForForm.get('dob').setValue(this.appState.userProfile.dob);
  }


  validationMessages = {
    'dob': [
      { type: 'required', message: 'Date of birth is required.' }
    ],
    'firstName': [
      { type: 'required', message: 'First name is required.' }
    ],
    'lastName': [
      { type: 'required', message: 'Last name is required.' }
    ]
  }
}
