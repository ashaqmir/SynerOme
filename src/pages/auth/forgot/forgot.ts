import { IonicPage, NavController, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthanticationServiceProvider } from '../../../providers/providers';
import { LoginPage } from '../../pages';


@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html'
})

export class ForgotPage {

  resetPasswordForm;
  backgroundImage = './assets/img/bg1.jpg';

  constructor(public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthanticationServiceProvider,
    private menu: MenuController
  ) {

    this.resetPasswordForm = formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$')
      ]))
    });
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }
  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      console.log("form is invalid = " + this.resetPasswordForm.value);
    } else {

      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();
      this.authProvider.resetPassword(this.resetPasswordForm.value.email)
        .then((user) => {
          loadingPopup.dismiss();
          this.presentAlert("We just sent you a reset link to your email");
          this.navCtrl.setRoot(LoginPage);
        }, (error) => {
          loadingPopup.dismiss();
          var errorMessage: string = error.message;
          this.presentAlert(errorMessage);
        });
    }
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

  validationMessages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ]
  };
}