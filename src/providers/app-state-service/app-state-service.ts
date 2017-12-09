import { Injectable } from '@angular/core';
import { IProfile } from '../../models/profile';


@Injectable()
export class AppStateServiceProvider {

  loginState: boolean = false;
  userProfile: IProfile;

  localStorageProfile: IProfile;

  constructor() {
    console.log('App state Contructor called');
  }

  setUserProfile(profile: IProfile) {
    if (profile) {
      this.userProfile = profile;
    } else {
      this.userProfile = null;
    }
    if (this.localStorageProfile) {
      this.localStorageProfile = null;
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
