import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { PasswordValidator } from '../../../../validators/validators';
import { AuthanticationServiceProvider } from '../../../../providers/providers';
import { IProfile, IUser } from '../../../../models/models';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { LoginPage, ConsumerConditionsPage } from '../../../pages';
import * as firebase from 'firebase';
import { fail } from 'assert';

@IonicPage()
@Component({
  selector: 'page-consumer-signup',
  templateUrl: 'consumer-signup.html',
})
export class ConsumerSignupPage {
  customerForm: FormGroup;
  matchingPasswordsGroup: FormGroup;
  profile: IProfile;
  emailMask = emailMask;
  showingConditions = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public authProvider: AuthanticationServiceProvider) {
  }

  ionViewWillLoad() {
    this.createForms();
  }

  ionViewDidEnter() {
    //this.showingConditions = false;
  }
  onSubmit(values) {
    if (values) {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();
      let removePop = true;
      let user = {} as IUser;
      user.email = values.email;
      user.password = values.password.password;
      this.authProvider.registerUser(user.email, user.password)
        .then(data => {
          this.profile = {} as IProfile;
          this.profile.id = data.uid;
          this.profile.email = user.email;
          this.profile.isNutritionist = false;
          this.profile.firstName = values.firstName;
          this.profile.lastName = values.lastName;
          this.profile.phone = values.phone;
          this.profile.isProfileComplete = false;
          console.log('Registered');
          console.log(data);
          this.authProvider.loginUser(user.email, user.password)
            .then(data => {
              this.authProvider.updateUserProfile(this.profile, data.uid).then(data => {
                let user: any = firebase.auth().currentUser;
                user.sendEmailVerification().then(
                  (success) => {
                    //Show toast and redirect to login
                    this.toast.create({
                      message: 'Verification mail sent, Please verify your email',
                      duration: 4000
                    }).present();
                    this.navCtrl.setRoot(LoginPage);
                    console.log("please verify your email")
                  }).catch((err) => {
                    console.log(err)
                  });
                //this.navCtrl.setRoot(ConsumerProfilePage, { profile: this.profile });
                if (removePop) {
                  loadingPopup.dismiss()
                  removePop = false;
                }
                this.navCtrl.setRoot(LoginPage);
              }).catch(error => {
                if (removePop) {
                  loadingPopup.dismiss()
                  removePop = false;
                }
                this.toast.create({
                  message: `profile not saved ${user.email}`,
                  duration: 3000
                }).present();
                this.navCtrl.setRoot(LoginPage)
              })
            }).catch(error => {
              if (removePop) {
                loadingPopup.dismiss()
                removePop = false;
              }
              this.toast.create({
                message: `login problem ${user.email}`,
                duration: 3000
              }).present();
              this.navCtrl.setRoot(LoginPage)
            })
        })
        .catch(error => {
          if (removePop) {
            loadingPopup.dismiss()
            removePop = false;
          }
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

    this.customerForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
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

  conditions(evt) {
    console.log(evt);
    if (!this.showingConditions) {
      this.showingConditions = true;
      //this.customerForm.get('terms').setValue(false);

      let conditionModal = this.modalCtrl.create(ConsumerConditionsPage)
      conditionModal.onDidDismiss(data => {
        let condition = data.condition;
        if (condition) {
          if (condition === 'accept') {
            this.customerForm.get('terms').setValue(true);
          }
          else {
            this.customerForm.get('terms').setValue(true);
          } 
        } else {
          this.customerForm.get('terms').setValue(true);
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