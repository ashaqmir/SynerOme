import { Injectable } from '@angular/core';
import { IProfile } from '../../models/profile';


@Injectable()
export class AppStateServiceProvider {

  loginState: boolean = false;
  userProfile: IProfile;

  localStorageProfile: IProfile;
  userOrders: any[];

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

  setUserOrders(orders) {
    if (orders) {
      this.userOrders = orders;
    } else {
      this.userOrders = [];
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

  // loadUserProfile(uid: string) {
  //   const profRef = this.afDb.object('/profiles/' + uid);
  //   let profSubs = profRef.snapshotChanges().subscribe(profData => {
  //     this.userProfile = profData.payload.val();
  //     this.userProfile
  //     if (this.userProfile) {
  //       this.events.publish('profile:recieved', this.userProfile);
  //       profSubs.unsubscribe();
  //       this.userProfile;
  //     } else {
  //       console.log('User Profile not found');
  //       //Check if local storage profile is there.
  //       this.storageHelper.getProfile(uid)
  //         .then((val) => {
  //           var value = JSON.stringify(val);
  //           this.localStorageProfile = JSON.parse(value);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         })
  //     }
  //   });
  // }
}
