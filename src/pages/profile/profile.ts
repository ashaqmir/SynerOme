import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import emailMask from 'text-mask-addons/dist/emailMask';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Country } from '../../models/models';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { IProfile } from '../../models/profile';
import { AuthanticationServiceProvider } from '../../providers/user-service/authantication-service';
import { HomePage } from '../pages';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

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

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private authService: AuthanticationServiceProvider) { }
   
  ionViewWillLoad() {
    this.afAuth.authState.take(1).subscribe(auth => {
      if (auth && auth.uid) {
      } else {
        this.navCtrl.setRoot('LoginPage');
      }
    });
    this.createForm();
  }

  onSubmit(values) {

    let profile = {} as IProfile

    profile.firstName = values.firstName;
    profile.lastName = values.lastName;
    profile.dob = values.dateofbirth;
    profile.country = values.country.name;
    profile.phone = values.phone;
    profile.gender = values.gender;

    console.log(profile);
    this.afAuth.authState.take(1).subscribe(auth => {
      if (auth && auth.uid) {
        profile.id=auth.uid;
        this.authService.createProfile(profile).then(data =>{
          console.log(data);
          this.navCtrl.setRoot(HomePage);
        });
      } else {
        this.navCtrl.setRoot('LoginPage');
      }
    });
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
