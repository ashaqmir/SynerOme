import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { IUser, IProfile } from '../../../models/models';
import { ForgotPage, DashboardPage, SignupTypePage, EmailVerificationPage, ConsumerProfilePage } from '../../pages';
import { AuthanticationServiceProvider, AppStateServiceProvider, StorageHelperProvider, UserDataPreloaderProvider } from '../../../providers/providers';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AngularFireDatabase } from 'angularfire2/database';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Events } from 'ionic-angular/util/events';

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
  loginForm: FormGroup;
  userProfile: IProfile;
  rememberMe: boolean = true;
  private appState: any;

  constructor(public navCtrl: NavController,
    public events: Events,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    appState: AppStateServiceProvider,
    public authProvider: AuthanticationServiceProvider,
    public storageHelper: StorageHelperProvider,
    public preLoader: UserDataPreloaderProvider,
    private loadingCtrl: LoadingController,
    private menu: MenuController) {
    this.appState = appState;
  }


  ionViewWillLoad() {

    this.loginForm = this.formBuilder.group({
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

    this.storageHelper.getLastUser()
      .then(data => {
        if (data) {
          this.loginForm.get('email').setValue(data.userName);
          this.loginForm.get('password').setValue(data.userPwd);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }

  goToSignupOptions() {
    this.navCtrl.push(SignupTypePage);
  }

  forgot() {
    this.navCtrl.push(ForgotPage);
  }

  async signIn(values) {
    let user = {} as IUser;
    let profSubs: any;
    user.email = values.email;
    user.password = values.password;
    console.log(user);
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
    try {
      this.authProvider.loginUser(user.email, user.password)
        .then(data => {
          let emailVerified = data.emailVerified;
          if (emailVerified) {
            this.appState.loginState = true;
            console.log(data.uid);
            this.preLoader.preloadUserData(data.uid, data.email).then(data => {
              console.log('Data Loaded');
              this.userProfile = this.appState.userProfile;
              console.log(this.appState.userProfile);
              if (this.appState.userProfile) {
                this.events.publish('profile:recieved', this.appState.userProfile);
                if (this.userProfile.isProfileComplete) {
                  loadingPopup.dismiss();
                  console.log('Tango Man');
                  this.navCtrl.setRoot(DashboardPage);
                  this.events.publish('profile:recieved', this.appState.userProfile);

                } else {
                  loadingPopup.dismiss();
                  this.navCtrl.setRoot(ConsumerProfilePage, { profile: this.userProfile });
                }
                if (this.rememberMe) {
                  let lastUser = {
                    userName: user.email,
                    userPwd: user.password
                  };

                  this.storageHelper.setLastUser(lastUser);
                } else {
                  this.storageHelper.removeLastUser();
                }

              } else {
                console.log('User Profile not found');
                loadingPopup.dismiss();
                this.toast.create({
                  message: 'User profile not found!',
                  duration: 3000
                }).present();
              }
            });
          } else {
            console.log('Email not verified.');
            loadingPopup.dismiss()
            this.navCtrl.setRoot(EmailVerificationPage);
          }
        })
        .catch(error => {
          var errorMessage: string = error.message;
          loadingPopup.dismiss().then(() => {
            this.toast.create({
              message: errorMessage,
              duration: 3000
            }).present();
          });
        });
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
