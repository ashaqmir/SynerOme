import { Injectable } from '@angular/core';
import { IProfile } from '../../models/profile';
import { BehaviorSubject } from 'rxjs/Rx';
import { retry } from 'rxjs/operator/retry';

@Injectable()
export class AppStateServiceProvider {

  loginState: boolean = false;
  userProfile: IProfile;

  constructor() {
    console.log('App state Contructor called');
  }

  setUserProfile(profile: IProfile) {
    if (profile) {
      this.userProfile = profile;
    } else {
      this.userProfile = null;
    }
  }

  setLoginState(state: boolean) {
    this.loginState = state;
  }


  getUserProfile(): IProfile {
    return this.userProfile
  }

  getLoginState(): boolean {
    return this.loginState
  }
}
