import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { IProfile } from '../../../models/models';
import { AppStateServiceProvider, StorageHelperProvider } from '../../../providers/providers';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage, HealthInfoPage } from '../../pages';

@IonicPage()
@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html',
})
export class PersonalInfoPage {

  backgroundImage = './assets/img/bg1.jpg';

  genders: string[] = [
    "Male",
    "Female"
  ];

  personalInfoForm: FormGroup;
  profile: IProfile;
  email: string;
  uid: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private appState: AppStateServiceProvider, 
    private storageHelper: StorageHelperProvider,) {
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
        this.profile.dob = values.dob;
        this.profile.birthgender = values.birthgender;
        this.profile.currentgender = values.currentgender
           
        console.log(this.profile);
        this.storageHelper.setProfile(this.uid, this.profile)
          .then((val) => {
            //Update local state object
            this.appState.localStorageProfile = this.profile;
            this.navCtrl.setRoot(HealthInfoPage);
          })
          .catch((error) => {
            console.log(error.message);
          });
    
    
      }

  createForm() {
    if (this.profile) {
      this.personalInfoForm = this.formBuilder.group({
        dob: new FormControl(this.profile.dob, Validators.required),
        birthgender: new FormControl(this.profile.birthgender, Validators.required),
        currentgender: new FormControl(this.profile.currentgender, Validators.required),
      });
    } else {
      this.personalInfoForm = this.formBuilder.group({
        dob: new FormControl('', Validators.required),
        birthgender: new FormControl('', Validators.required),
        currentgender: new FormControl('', Validators.required),
      });
    }

  }
  updateFormValues() {

    this.personalInfoForm.get('dob').setValue(this.profile.dob);
    this.personalInfoForm.get('birthgender').setValue(this.profile.birthgender);
    this.personalInfoForm.get('currentgender').setValue(this.profile.currentgender);

  }
 

  validationMessages = {
    'dob': [
      { type: 'required', message: 'Date of birth is required.' }
    ],
    'birthgender': [
      { type: 'required', message: 'Gender at birth is required.' }
    ],
    'currentgender': [
      { type: 'required', message: 'Current gender at birth is required.' }
    ],
  }
}
