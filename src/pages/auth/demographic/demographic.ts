import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, LoadingController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { IProfile } from '../../../models/models';
import { LoginPage, DashboardPage } from '../../pages';
import {
  AuthanticationServiceProvider, AppStateServiceProvider,
  StorageHelperProvider
} from '../../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-demographic',
  templateUrl: 'demographic.html',
})
export class DemographicPage {

  backgroundImage = './assets/img/bg1.jpg';

  profileForm: FormGroup;

  isNutritionist: boolean = false;
  nutritionistLicenseNumber: string = '';
  userEmail: string;
  profile: IProfile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private menu: MenuController,
    private appState: AppStateServiceProvider,
    private storageHelper: StorageHelperProvider,
    public authProvider: AuthanticationServiceProvider
  ) {
  }

  ionViewWillLoad() {
    this.isNutritionist = this.navParams.get('isNutritionist');
    this.nutritionistLicenseNumber = this.navParams.get('nutritionistLicenseNumber');

    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.userEmail = userAuth.email;
        this.storageHelper.getProfile(userAuth.uid)
          .then((val) => {
            var value = JSON.stringify(val);
            this.setProfileVal(JSON.parse(value));
          })
      }
      else {
        console.log('auth false');
        this.navCtrl.setRoot(LoginPage);
      }
    });
    this.createForm();
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }

  onSubmit(values) {
    if (values) {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();

      this.profile = {} as IProfile

      this.profile.firstName = values.firstName;
      this.profile.lastName = values.lastName;
      this.profile.phone = values.phone;

      if (this.nutritionistLicenseNumber) {
        this.profile.isNutritionist = true;
        this.profile.nutritionistLicenseNumber = this.nutritionistLicenseNumber;
      }

      this.afAuth.authState.subscribe(auth => {
        if (auth && auth.uid) {
          this.profile.email = auth.email;
          this.storageHelper.setProfile(auth.uid, this.profile)
            .then((val) => {

              console.log(this.profile);
              //Update local state object
              this.appState.localStorageProfile = this.profile;

              this.authProvider.updateUserProfile(this.profile, auth.uid)
                .then(pData => {
                  const profRef = this.afDb.object('/profiles/' + auth.uid);
                  profRef.snapshotChanges().subscribe(profData => {
                    this.profile = profData.payload.val();
                    this.appState.setUserProfile(this.profile);
                    this.events.publish('profile:recieved', this.appState.userProfile);
                    console.log(profData);
                    loadingPopup.dismiss()
                    this.storageHelper.clearStorage();
                    this.navCtrl.setRoot(DashboardPage);
                  });
                })
                .catch(error => {
                  console.log(error.message);
                  loadingPopup.dismiss()
                  this.toast.create({
                    message: error.message,
                    duration: 3000
                  }).present();
                })

            })
            .catch((error) => {
              console.log(error.message);
            })

        } else {
          this.navCtrl.setRoot(LoginPage);
        }
      });

    } else {
      this.toast.create({
        message: 'No user data found',
        duration: 3000
      }).present();
    }

  }

  setProfileVal(profile) {
    if (profile) {
      this.isNutritionist = profile.isNutritionist;
      if (profile.nutritionistLicenseNumber) {
        this.nutritionistLicenseNumber = profile.nutritionistLicenseNumber;
      }
    }
    console.log(this.isNutritionist);
    console.log(this.nutritionistLicenseNumber);

  }

  createForm() {
    this.profileForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[1-9][0-9]{9,11}$')
      ])),
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  validationMessages = {
    'firstname': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ]
  };

}
