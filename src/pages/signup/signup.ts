import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { PasswordValidator } from '../../validators/validators';
import { IUser } from '../../models/user';
import { AuthanticationServiceProvider } from '../../providers/user-service/authantication-service';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  validationsForm: FormGroup;
  matchingPasswordsGroup: FormGroup;

  emailMask = emailMask;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private authService: AuthanticationServiceProvider) {
  }

  ionViewWillLoad() {

    this.matchingPasswordsGroup = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirmPassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });


    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: this.matchingPasswordsGroup
    });
  }


  onSubmit(values) {
    let user = {} as IUser;
    user.email = values.email;
    user.password = values.password.password;
    
    this.authService.register(user).then(data=>{
      console.log(data);
      this.navCtrl.setRoot('ProfilePage');
    }).catch(error=>{
      console.log(error);
    })
  }

  validationMessages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required' }
    ]
  };
}