import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import emailMask from 'text-mask-addons/dist/emailMask';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Country } from '../../../models/models';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { IProfile } from '../../../models/models';
import { LoginPage, DashboardPage } from '../../pages';
import { AuthanticationServiceProvider } from '../../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-demographic',
  templateUrl: 'demographic.html',
})
export class DemographicPage {

  backgroundImage = './assets/img/bg1.jpg';

  validationsForm: FormGroup;
  matchingPasswordsGroup: FormGroup;

  emailMask = emailMask;

  countries: Country[] = [
    new Country('US', 'United States'),
    new Country('CA', 'Canada'),
    new Country('UK', 'United Kingdom')
  ];

  genders: string[] = [
    "Male",
    "Female"
  ];

  isNutritionist: boolean = false;
  nutritionistLicenseNumber: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private afAuth: AngularFireAuth,
    public authProvider: AuthanticationServiceProvider,
    private menu: MenuController
  ) {

    this.isNutritionist = this.navParams.get('isNutritionist');
    this.nutritionistLicenseNumber = this.navParams.get('nutritionistLicenseNumber');
  }

  ionViewWillLoad() {
    if (!this.afAuth.auth.currentUser) {
      this.navCtrl.setRoot(LoginPage);
    }
    this.createForm();
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }

  onSubmit(values) {

    let profile = {} as IProfile

    profile.firstName = values.firstName;
    profile.lastName = values.lastName;
    profile.dob = values.dateofbirth;
    profile.country = values.country.name;
    profile.phone = values.phone;
    profile.birthgender = values.gender;
    profile.isNutritionist = this.isNutritionist;
    profile.nutritionistLicenseNumber = this.nutritionistLicenseNumber;

    console.log(profile);
    this.afAuth.authState.subscribe(auth => {
      if (auth && auth.uid) {
        profile.id = auth.uid;
        this.createProfile(profile, auth.uid);
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }
  createProfile(profile: IProfile, uid: string) {

    this.authProvider.updateUserProfile(profile, uid)
      .then(data => {
        console.log(data);
        this.navCtrl.setRoot(DashboardPage);
      })
      .catch(error => {
        console.log(error.message);
        this.toast.create({
          message: error.message,
          duration: 3000
        }).present();
      })

  }

  createForm() {
    this.validationsForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateofbirth: new FormControl('', Validators.required),
      gender: new FormControl(this.genders[0], Validators.required),
      country: new FormControl(this.countries[0], Validators.required),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[1-9][0-9]{9,11}$')
      ])),
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }
  validationMessages = {
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],

    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };


}
