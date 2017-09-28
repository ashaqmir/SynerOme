import {LandingPage} from '../landing/landing';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  isReadyToLogin: boolean;
  item: any;
  form: FormGroup;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
      });

      this.form.valueChanges.subscribe((v)=> {
        this.isReadyToLogin=this.form.valid;
      });
  }
  goToDashboard(params){
    if (!params) params = {};
    if(!this.form.valid) { return }
    this.navCtrl.setRoot(LandingPage);
  }
  
  goToSignup(params){
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }
}
