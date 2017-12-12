import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { IUser, IProfile } from '../../../models/models';
import { SignupPage, ForgotPage, DashboardPage, AddressPage } from '../../pages';
import { AuthanticationServiceProvider, AppStateServiceProvider, StorageHelperProvider } from '../../../providers/providers';
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

  backgroundImage = './assets/img/bg1.jpg';

  isReadyToLogin: boolean;
  item: any;
  form: FormGroup;
  user = {} as IUser;
  loginForm: FormGroup;
  userProfile: IProfile;

  constructor(public navCtrl: NavController,
    public events: Events,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private appState: AppStateServiceProvider,
    public authProvider: AuthanticationServiceProvider,
    private afDb: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private menu: MenuController,
    private storageHelper: StorageHelperProvider) {

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
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }

  forgot() {
    this.navCtrl.push(ForgotPage);
  }

  async signIn(values) {
    let user = {} as IUser;
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
          this.appState.setLoginState(true);
          console.log(data.uid);
          const profRef = this.afDb.object('/profiles/' + data.uid);
          profRef.snapshotChanges().subscribe(profData => {
            this.userProfile = profData.payload.val();
            this.appState.setUserProfile(this.userProfile);
            if (this.appState.userProfile) {
              loadingPopup.dismiss();
              this.navCtrl.setRoot(DashboardPage);
              this.events.publish('profile:recieved', this.appState.userProfile);
            } else {
              console.log('User Profile not found');
              //Check if local storage profile is there.
              this.storageHelper.getProfile(data.uid)
                .then((val) => {
                  var value = JSON.stringify(val);
                  this.appState.localStorageProfile = JSON.parse(value);
                  console.log('Local Profile Recived');
                  console.log(this.appState.localStorageProfile);
                  loadingPopup.dismiss()
                  this.navCtrl.setRoot(AddressPage);
                })
                .catch((error) => {
                  console.log(error);
                  loadingPopup.dismiss()
                  this.navCtrl.setRoot(AddressPage);
                })
            }
          });
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
