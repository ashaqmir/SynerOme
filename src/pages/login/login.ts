import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import emailMask from 'text-mask-addons/dist/emailMask';
import { IUser } from '../../models/user';
import { HomePage } from '../pages';
import { AuthanticationServiceProvider } from '../../providers/user-service/authantication-service';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  isReadyToLogin: boolean;
  item: any;
  form: FormGroup;
  user = {} as IUser;
  validationsForm: FormGroup;

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private authService: AuthanticationServiceProvider,
    private toast: ToastController,
    public appState: AppStateServiceProvider,
    private fDb: AngularFireDatabase,) {
  }
  
  ionViewWillLoad() {
    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });
  }

  goToSignup() {
    this.navCtrl.push("SignupPage");
  }


  onSubmit(values) {
    let user = {} as IUser;
    user.email = values.email;
    user.password = values.password;
    console.log(user);
    this.authService.login(user)
      .then(data => {
        console.log('Logged in View');
        console.log(this.appState.loginStateSet);
        console.log(this.appState.userProfile);

        if (this.appState.loginStateSet && this.appState.userProfile) {
          this.navCtrl.setRoot(HomePage);
        } else if (this.appState.loginStateSet) {
          this.navCtrl.setRoot('ProfilePage');
        }
      }).catch(error => {
        this.toast.create({
          message: `User not found , ${user.email}`,
          duration: 3000
        }).present();
      });
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
