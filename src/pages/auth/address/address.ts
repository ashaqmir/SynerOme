import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

import Countries from '../../../models/countries'
import { IProfile } from '../../../models/models';
import { StorageHelperProvider, AppStateServiceProvider } from '../../../providers/providers';
import { LoginPage, PersonalInfoPage } from '../../pages';
import { Console } from '@angular/core/src/console';

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
  profile: IProfile;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private afAuth: AngularFireAuth,
    private storageHelper: StorageHelperProvider,
    private loadingCtrl: LoadingController,
    private appState: AppStateServiceProvider, ) {

    this.selectedRegions = this.countries[0].regions;
    this.coutryDialCode = this.countries[0].callingCode;
  }
  ionViewWillLoad() {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.email = this.afAuth.auth.currentUser.email;
        this.uid = this.afAuth.auth.currentUser.uid;
        if (this.appState.localStorageProfile) {
          this.profile = this.appState.localStorageProfile;
          console.log('Inside Addres');
          console.log(this.appState.localStorageProfile);
          this.updateFormValues();
        }
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

    if (this.profile) {
      this.addressForm = this.formBuilder.group({
        firstName: new FormControl(this.profile.firstName, Validators.required),
        lastName: new FormControl(this.profile.lastName, Validators.required),
        street: new FormControl(this.profile.street, Validators.required),
        city: new FormControl(this.profile.city, Validators.required),
        country: new FormControl(this.profile.country, Validators.required),
        region: new FormControl(this.profile.region, Validators.required),
        zip: new FormControl(this.profile.zip, Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5,7}$')
        ])),
        phone: new FormControl(this.profile.phone, Validators.compose([
          Validators.required,
          Validators.pattern('^[1-9][0-9]{9,11}$')
        ])),
      });
    } else {
      this.addressForm = this.formBuilder.group({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        country: new FormControl(this.countries[0], Validators.required),
        region: new FormControl(this.selectedRegions[0], Validators.required),
        zip: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5,7}$')
        ])),
        phone: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[1-9][0-9]{9,11}$')
        ])),
      });
    }
  }

  getRegions() {
    this.selectedRegions = this.addressForm.value.country.regions;
    this.coutryDialCode = this.addressForm.value.country.callingCode;
  }

  onSubmit(values) {

    if (!this.profile) {
      this.profile = {} as IProfile
    }
    this.profile.firstName = values.firstName;
    this.profile.lastName = values.lastName;
    this.profile.street = values.street
    this.profile.city = values.city;
    this.profile.country = values.country.name;
    this.profile.region = values.region.name;
    this.profile.phone = values.phone;
    this.profile.zip = values.zip;

    console.log(this.profile);
    this.storageHelper.setProfile(this.uid, this.profile)
      .then((val) => {
        //Update local state object
        this.appState.localStorageProfile = this.profile;
        this.navCtrl.setRoot(PersonalInfoPage);
      })
      .catch((error) => {
        console.log(error.message);
      });


  }

  updateFormValues() {

    this.addressForm.get('firstName').setValue(this.profile.firstName);
    this.addressForm.get('lastName').setValue(this.profile.lastName);
    this.addressForm.get('street').setValue(this.profile.street);
    this.addressForm.get('city').setValue(this.profile.city);

    this.addressForm.get('zip').setValue(this.profile.zip);
    this.addressForm.get('phone').setValue(this.profile.phone);

    var country = this.countries.find(ctry => ctry.name == this.profile.country);
    if (country) {
      this.addressForm.get('country').setValue(country);

      var states = country.regions;
      if (states) {
        console.log(states);
        this.selectedRegions = states;
        var state = states.find(stat => stat.name == this.profile.region);
        if (state) {
          console.log(state);
          this.addressForm.get('region').setValue(state);
        }
      }
    }   
  }

  
  validationMessages = {
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
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
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    'zip': [
      { type: 'required', message: 'Zip is required. 5-7 digits between 0-9' },
      { type: 'validCountryPhone', message: 'Zip incorrect for the country selected' }
    ]
  };

}
