import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { PasswordValidator } from '../../validators/validators';
import { IUser } from '../../models/user';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  backgroundImage = 'assets/img/SynerOme_back.webp';

  validationsForm: FormGroup;
  matchingPasswordsGroup: FormGroup;

  emailMask = emailMask;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    public appState: AppStateServiceProvider,
    private fDb: AngularFireDatabase,
    private afAuth: AngularFireAuth) {
  }

  ionViewWillLoad() {
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

    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: this.matchingPasswordsGroup
    });
  }


  onSubmit(values) {
    if (values) {
      let user = {} as IUser;
      user.email = values.email;
      user.password = values.password.password;

      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
        .then(data => {
          console.log('Registered');
          console.log(data);
          this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
            .then(data => {
              this.navCtrl.setRoot('ProfilePage');
            })
        })
        .catch(error => {
          this.toast.create({
            message: `User not found ${user.email}`,
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
    ]
  };
}