import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { PasswordValidator } from '../../../validators/validators';
import { AuthanticationServiceProvider, StorageHelperProvider } from '../../../providers/providers';
import { IProfile, IUser } from '../../../models/models';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { DemographicPage, LoginPage } from '../../pages';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  backgroundImage = './assets/img/bg1.jpg';

  customerForm: FormGroup;
  nutritionistForm: FormGroup;
  matchingPasswordsGroup: FormGroup;
  profile: IProfile;
  emailMask = emailMask;
  msg: string = '';
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private menu: MenuController,
    private loadingCtrl: LoadingController,
    private storageHelper: StorageHelperProvider,
    public authProvider: AuthanticationServiceProvider
  ) {
  }

  ionViewWillLoad() {
    this.createForms();
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }
  updateForm(value) {
    if (value) {
      this.msg = "Nutritionist";

    }

    if (!value) {
      this.msg = "Not Nutritionist";
    }
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

      var nutritionistLicenseNum = '';
      if (values.nutritionistLicenseNum) {
        nutritionistLicenseNum = values.nutritionistLicenseNum;
      }

      this.authProvider.registerUser(user.email, user.password)
        .then(data => {
          this.profile = {} as IProfile;
          this.profile.email = user.email;
          this.profile.isNutritionist = false;

          if (nutritionistLicenseNum) {
            this.profile.isNutritionist = true;
            this.profile.nutritionistLicenseNumber = nutritionistLicenseNum;
          }
          this.storageHelper.setProfile(data.uid, this.profile)
          console.log('Registered');
          console.log(data);
          this.authProvider.loginUser(user.email, user.password)
            .then(data => {
              loadingPopup.dismiss()
              this.navCtrl.setRoot(DemographicPage, {
                isNutritionist:  this.profile.isNutritionist,
                nutritionistLicenseNumber: nutritionistLicenseNum
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
      isNutritionist: new FormControl(true, Validators.required),
      nutritionistLicenseNum: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]{6,10}$')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$')
      ])),
      password: this.matchingPasswordsGroup
    });

    this.customerForm = this.formBuilder.group({
      isNutritionist: new FormControl(false, Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$')
      ])),
      password: this.matchingPasswordsGroup
    });
  }

  validationMessages = {

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
    ]
  };
}