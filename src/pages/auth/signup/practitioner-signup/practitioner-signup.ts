import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { PasswordValidator } from '../../../../validators/validators';
import { AuthanticationServiceProvider, StorageHelperProvider } from '../../../../providers/providers';
import { IProfile, IUser } from '../../../../models/models';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { DemographicPage, LoginPage, PractitionerConditionsPage } from '../../../pages';


@IonicPage()
@Component({
  selector: 'page-practitioner-signup',
  templateUrl: 'practitioner-signup.html',
})
export class PractitionerSignupPage {
  nutritionistForm: FormGroup;
  matchingPasswordsGroup: FormGroup;
  profile: IProfile;
  emailMask = emailMask;
  msg: string = '';
  showingConditions = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private toast: ToastController,    
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private storageHelper: StorageHelperProvider,
    public authProvider: AuthanticationServiceProvider) {
  }
  ionViewWillLoad() {
    this.createForms();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PractitionerSignupPage');
  }
  onSubmit(values) {
    if (values) {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();

      let user = {} as IUser;
      user.email = values.email;
      user.password = values.password.password;

      this.authProvider.registerUser(user.email, user.password)
        .then(data => {
          this.profile = {} as IProfile;
          this.profile.email = user.email;
          this.profile.isNutritionist = true;
          this.profile.firstName = values.firstName;
          this.profile.lastName = values.lastName;
          this.profile.nutritionistLicenseNumber = values.nutritionistLicenseNum;

          this.storageHelper.setProfile(data.uid, this.profile)
          console.log('Registered');
          console.log(data);
          this.authProvider.loginUser(user.email, user.password)
            .then(data => {
              loadingPopup.dismiss()
              this.navCtrl.setRoot(DemographicPage, {
                isNutritionist: this.profile.isNutritionist,
                nutritionistLicenseNumber: this.profile.nutritionistLicenseNumber
              });
            }).catch(error => {
              loadingPopup.dismiss()
              this.toast.create({
                message: `login problem ${user.email}`,
                duration: 3000
              }).present();
              this.navCtrl.setRoot(LoginPage)
            })
        })
        .catch(error => {
          loadingPopup.dismiss()
          this.toast.create({
            message: error,
            duration: 3000
          }).present();
        })
    } else {
      this.toast.create({
        message: 'No user data found',
        duration: 3000
      }).present();
    }
  }
  createForms() {
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

    this.nutritionistForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      nutritionistLicenseNum: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]{6,10}$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[1-9][0-9]{9,11}$')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$')
      ])),
      password: this.matchingPasswordsGroup,
      terms: new FormControl(false, Validators.pattern('true')),
    });
  }

  conditions() {
    if (!this.showingConditions) {
      this.showingConditions = true;
      this.nutritionistForm.get('terms').setValue(false);

      let conditionModal = this.modalCtrl.create(PractitionerConditionsPage)
      conditionModal.onDidDismiss(data => {
        let condition = data.condition;
        if (condition) {
          if (condition === 'accept') {
            this.nutritionistForm.get('terms').setValue(true);

          }
        }
        this.showingConditions = false;
      });
      conditionModal.present();

    }

  }
  validationMessages = {
    'firstname': [
      { type: 'required', message: 'First name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    'nutritionistLicenseNum': [
      { type: 'required', message: 'License number is required.' },
      { type: 'minlength', message: 'License number must be 6-10 digits.' },
      { type: 'maxlength', message: 'License number must be 6-10 digits.' },
      { type: 'pattern', message: 'License number must contains digits (0-9) only.' }
    ],
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
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ]
  };
}
