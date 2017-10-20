
import emailMask from 'text-mask-addons/dist/emailMask';
import { Component, ViewChild } from '@angular/core';
import { AlertController, App, LoadingController, NavController, Slides, IonicPage } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Country, IUser } from '../../models/models';
import { PasswordValidator } from '../../validators/validators';

@IonicPage()
@Component({
  selector: 'page-startup',
  templateUrl: 'startup.html',
})
export class StartupPage {
  public loginForm: any;
  public backgroundImage = 'assets/img/SynerOme_back.webp';

  signupForm: FormGroup;
  profilePersonelForm: FormGroup;
  profileDemographicForm: FormGroup;
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

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder
  ) { }

  // Slider methods
  @ViewChild('startupSlider') startupSlider: Slides;
  @ViewChild('signinSlider') signinSlider: Slides;
  @ViewChild('innerSingupSlider') innerSingupSlider: Slides;


  

  ionViewWillLoad() {
    this.startupSlider.lockSwipes(true);
    this.signinSlider.lockSwipes(true);
    this.innerSingupSlider.lockSwipes(true);
    this.createSignupForm();
  }


  goToLogin() {
    this.startupSlider.lockSwipes(false);
    this.signinSlider.lockSwipes(false);
    this.startupSlider.slideTo(1);
    this.startupSlider.lockSwipes(true);
    this.signinSlider.lockSwipes(true);
  }

  goToSignup() {
    this.startupSlider.lockSwipes(false);
    this.innerSingupSlider.lockSwipes(false);
    this.startupSlider.slideTo(2);
    this.startupSlider.lockSwipes(true);
    this.innerSingupSlider.lockSwipes(true);

  }

  slideNext() {
    this.signinSlider.slideNext();
  }

  slidePrevious() {
    this.signinSlider.slidePrev();
  }

  presentLoading(message) {
    const loading = this.loadingCtrl.create({
      duration: 500
    });

    loading.onDidDismiss(() => {
      const alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: message,
        buttons: ['Dismiss']
      });
      alert.present();
    });

    loading.present();
  }

  login() {
    this.presentLoading('Thanks for signing up!');
    // this.navCtrl.push(HomePage);
  }

  signup(values) {
    let user = {} as IUser;
    user.email = values.email;
    user.password = values.password.password;
    
    this.innerSingupSlider.slideNext();
  }

  nextprofile() {
    this.innerSingupSlider.slideNext();
  }

  saveprofile() {

    this.presentLoading('Thanks for signing up!');
  }

  resetPassword() {
    this.presentLoading('An e-mail was sent with your new password.');
  }



  createPersonelForm() {
    this.profilePersonelForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateofbirth: new FormControl('', Validators.required),
      gender: new FormControl(this.genders[0], Validators.required),
    });
  }

  createDemographicForm() {
    this.profilePersonelForm = this.formBuilder.group({
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl(this.countries[0], Validators.required),
      zip: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(6),
        Validators.pattern('^\d{4,6}$')
      ])),
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  createSignupForm() {

    this.matchingPasswordsGroup = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirmPassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.signupForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: this.matchingPasswordsGroup
    });

  }


  getKey(event){
    console.log('Hello');
  }
  //Validation messages
  validationMessages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required' }
    ],
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
