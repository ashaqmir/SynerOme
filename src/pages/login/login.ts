import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import emailMask from 'text-mask-addons/dist/emailMask';
import { IUser } from '../../models/user';
import { HomePage, SignupPage } from '../pages';
import { AuthanticationServiceProvider } from '../../providers/user-service/authantication-service';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  backgroundImage = 'assets/img/SynerOme_back.webp';
  
  isReadyToLogin: boolean;
  item: any;
  form: FormGroup;
  user = {} as IUser;
  validationsForm: FormGroup;


  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    public appState: AppStateServiceProvider,
    private fDb: AngularFireDatabase,
    private afAuth: AngularFireAuth, ) {
  }

  ionViewWillLoad() {

    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }


  async signIn(values) {
    let user = {} as IUser;
    user.email = values.email;
    user.password = values.password;
    console.log(user);

    try {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
        .then(date => {
          this.appState.loginStateSet = true;
          this.navCtrl.setRoot(HomePage);
        })
        .catch(error => {
          this.toast.create({
            message: `User not found , ${user.email}`,
            duration: 3000
          }).present();
        })
    } catch (error) {
      this.toast.create({
        message: error.message,
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
      { type: 'required', message: 'Password is required.' }
    ]
  };
}
