import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IProfile } from '../../../models/models';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppStateServiceProvider, StorageHelperProvider, AuthanticationServiceProvider } from '../../../providers/providers';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoginPage } from '../auth';
import { ConsumerDashboardPage } from '../../consumer/consumer';


@IonicPage()
@Component({
  selector: 'page-health-info',
  templateUrl: 'health-info.html',
})
export class HealthInfoPage {

  backgroundImage = './assets/img/bg1.jpg';

  races: string[] = [
    "White",
    "African American",
    "Asian",
    "Alaska Natives",
    "American Indian",
    "Native Hawaiian"
  ];

  seelpqualities: string[] = [
    "Amazin",
    "Wakeup frequently",
    "Wakeup exausted",
    "Alaska Natives",
    "Disfficulty breathing/sleep apnea"
  ];

  healthInfoForm: FormGroup;
  profile: IProfile;
  email: string;
  uid: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private appState: AppStateServiceProvider,
    private storageHelper: StorageHelperProvider,
    public authProvider: AuthanticationServiceProvider) {
  }

  ionViewWillLoad() {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.email = this.afAuth.auth.currentUser.email;
        this.uid = this.afAuth.auth.currentUser.uid;
        if (this.appState.localStorageProfile) {
          this.profile = this.appState.localStorageProfile;
          console.log('Inside Addres');
          console.log(this.appState.localStorageProfile);
          this.updateFormValues();
        }
        loadingPopup.dismiss();
      }
      else {
        console.log('auth false');
        loadingPopup.dismiss();
        this.navCtrl.setRoot(LoginPage);
      }
    });

    this.createForm();
  }
  onSubmit(values) {

    if (!this.profile) {
      this.profile = {} as IProfile
    }
    this.profile.bodyweight = values.bodyweight;
    this.profile.height = values.height;
    this.profile.race = values.race;
    this.profile.sleepquality = values.sleepquality;

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.storageHelper.setProfile(this.uid, this.profile)
      .then((val) => {
        //Update local state object
        this.appState.localStorageProfile = this.profile;

        this.authProvider.updateUserProfile(this.profile, this.uid)
          .then(data => {
            const profRef = this.afDb.object('/profiles/' + this.uid);
            profRef.snapshotChanges().subscribe(profData => {
              this.profile = profData.payload.val();
              this.appState.localStorageProfile = this.profile;

              console.log(data);
              loadingPopup.dismiss()
              this.storageHelper.clearStorage();
              this.navCtrl.setRoot(ConsumerDashboardPage);
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
      });


  }

  createProfile(profile: IProfile, uid: string) {


  }

  createForm() {
    if (this.profile) {
      this.healthInfoForm = this.formBuilder.group({
        bodyweight: new FormControl(this.profile.bodyweight, Validators.required),
        height: new FormControl(this.profile.height, Validators.required),
        race: new FormControl(this.profile.race, Validators.required),
        sleepquality: new FormControl(this.profile.sleepquality, Validators.required),
      });
    } else {
      this.healthInfoForm = this.formBuilder.group({
        bodyweight: new FormControl('', Validators.required),
        height: new FormControl('', Validators.required),
        race: new FormControl('', Validators.required),
        sleepquality: new FormControl('', Validators.required),
      });
    }

  }
  updateFormValues() {

    this.healthInfoForm.get('bodyweight').setValue(this.profile.bodyweight);
    this.healthInfoForm.get('height').setValue(this.profile.height);
    this.healthInfoForm.get('race').setValue(this.profile.race);
    this.healthInfoForm.get('sleepquality').setValue(this.profile.sleepquality);

  }


  validationMessages = {
    'bodyweight': [
      { type: 'required', message: 'Body wheigh is required.' }
    ],
    'height': [
      { type: 'required', message: 'Height is required.' }
    ],
    'race': [
      { type: 'required', message: 'Race is required.' }
    ],
    'sleepquality': [
      { type: 'required', message: 'Sleep quality is required.' }
    ],
  }
}