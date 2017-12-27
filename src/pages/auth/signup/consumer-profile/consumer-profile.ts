import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../../../providers/providers';
import { IProfile } from '../../../../models/models';
import { LoginPage, DashboardPage } from '../../../pages';


@IonicPage()
@Component({
  selector: 'page-consumer-profile',
  templateUrl: 'consumer-profile.html',
})
export class ConsumerProfilePage {
  personalInfoForm: FormGroup;

  genders: string[] = [
    "Male",
    "Female"
  ];
  email: string;
  uid: string;
  profile: IProfile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    public authProvider: AuthanticationServiceProvider,
    private appState: AppStateServiceProvider) {
    this.createForm();
  }

  ionViewWillLoad() {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();
    let removePop = true;
    this.afAuth.authState.subscribe(userAuth => {
      if (userAuth) {
        this.email = this.afAuth.auth.currentUser.email;
        this.uid = this.afAuth.auth.currentUser.uid;
        this.profile = this.navParams.get('profile');
        if (removePop) {
          loadingPopup.dismiss()
          removePop = false;
        }
      }
      else {
        console.log('auth false');
        if (removePop) {
          loadingPopup.dismiss()
          removePop = false;
        }
        this.navCtrl.setRoot(LoginPage);
      }
    });

  }

  onSubmit(values) {
    if (!this.profile) {
      this.profile = {} as IProfile
    }
    this.profile.dob = values.dob;
    this.profile.birthgender = values.gender;
    this.profile.isProfileComplete = true;
    console.log(this.profile);

    this.authProvider.updateUserProfile(this.profile, this.uid)
      .then(profData => {
        //this.profile = profData.payload.val();
        this.appState.setUserProfile(this.profile);
        this.navCtrl.setRoot(DashboardPage);
      }).catch((error) => {
        console.log(error.message);
      });
  }

  createForm() {
    this.personalInfoForm = this.formBuilder.group({
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required)
    });
  }

  skip(){
    this.navCtrl.setRoot(DashboardPage);
  }

  validationMessages = {
    'dob': [
      { type: 'required', message: 'Date of birth is required.' }
    ],
    'gender': [
      { type: 'required', message: 'Gender at birth is required.' }
    ]
  }
}
