import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

import Countries from '../../models/countries'
import { IProfile, IAddress } from '../../models/models';
import { StorageHelperProvider, AppStateServiceProvider, AuthanticationServiceProvider } from '../../providers/providers';
import { LoginPage, PersonalInfoPage } from '../pages';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

  backgroundImage = './assets/img/bg1.jpg';

  addressForm: FormGroup;
  countries: any[] = Countries
  selectedRegions: any[];
  coutryDialCode: string;
  email: string;
  uid: string;
  nutritionistLicenseNum: string = '';
  address: IAddress;
  userProfile: IProfile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public events: Events,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private storageHelper: StorageHelperProvider,
    private loadingCtrl: LoadingController,
    private appState: AppStateServiceProvider,
    public authProvider: AuthanticationServiceProvider) {

    this.selectedRegions = this.countries[0].regions;
    this.coutryDialCode = this.countries[0].callingCode;
  }
  ionViewWillLoad() {
    this.nutritionistLicenseNum = this.navParams.get('nutritionistLicense');

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.email = this.afAuth.auth.currentUser.email;
        this.uid = this.afAuth.auth.currentUser.uid;
        this.userProfile = this.appState.userProfile;
        loadingPopup.dismiss();
      }
      else {
        console.log('auth false');
        loadingPopup.dismiss();
        this.navCtrl.setRoot(LoginPage);
      }
    });

    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressPage');
  }


  createForm() {
    //console.log('Printing Profile');

    if (this.address) {
      this.addressForm = this.formBuilder.group({
        isDefault: new FormControl(false, Validators.required),
        street: new FormControl(this.address.street, Validators.required),
        city: new FormControl(this.address.city, Validators.required),
        country: new FormControl(this.address.country, Validators.required),
        region: new FormControl(this.address.region, Validators.required),
        zip: new FormControl(this.address.zip, Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5,7}$')
        ]))
      });
    } else {
      this.addressForm = this.formBuilder.group({
        isDefault: new FormControl(true, Validators.required),
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        country: new FormControl(this.countries[0], Validators.required),
        region: new FormControl(this.selectedRegions[0], Validators.required),
        zip: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5,7}$')
        ])),
      });
    }
  }

  getRegions() {
    this.selectedRegions = this.addressForm.value.country.regions;
    this.coutryDialCode = this.addressForm.value.country.callingCode;
  }

  onSubmit(values) {
    if (!this.address) {
      this.address = {} as IAddress

      this.address.street = values.street
      this.address.city = values.city;
      this.address.country = values.country.name;
      this.address.region = values.region.name;
      this.address.zip = values.zip;
      this.address.isDefault = values.isDefault;
      this.address.type = 'shipping';

      if (!this.userProfile.Addresses) {
        this.userProfile.Addresses = [] as IAddress[];
      }
      this.userProfile.Addresses.push(this.address);
      this.authProvider.updateUserProfile(this.userProfile, this.uid)
        .then(profDate => {
          const profRef = this.afDb.object('/profiles/' + this.uid);
          profRef.snapshotChanges().subscribe(profData => {
            this.userProfile = profData.payload.val();
            this.appState.setUserProfile(this.userProfile);
            this.events.publish('profile:recieved', this.appState.userProfile);
          });
          this.viewCtrl.dismiss();
        });

    }
  }

  updateFormValues() {
    this.addressForm.get('street').setValue(this.address.street);
    this.addressForm.get('city').setValue(this.address.city);

    this.addressForm.get('zip').setValue(this.address.zip);

    var country = this.countries.find(ctry => ctry.name == this.address.country);
    if (country) {
      this.addressForm.get('country').setValue(country);

      var states = country.regions;
      if (states) {
        console.log(states);
        this.selectedRegions = states;
        var state = states.find(stat => stat.name == this.address.region);
        if (state) {
          console.log(state);
          this.addressForm.get('region').setValue(state);
        }
      }
    }
  }


  validationMessages = {
    'street': [
      { type: 'required', message: 'street/ building required.' }
    ],
    'city': [
      { type: 'required', message: 'City name is required.' }
    ],
    'country': [
      { type: 'required', message: 'Please select a country.' }
    ],
    'region': [
      { type: 'required', message: 'Please select a country.' }
    ],
    'zip': [
      { type: 'required', message: 'Zip is required. 5-7 digits between 0-9' },
      { type: 'validCountryPhone', message: 'Zip incorrect for the country selected' }
    ]
  };

}
