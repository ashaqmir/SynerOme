import { Injectable } from '@angular/core';
import { IProfile } from '../../models/profile';


@Injectable()
export class AppStateServiceProvider {

  loginState: boolean = false;
  userProfile: IProfile;

  localStorageProfile: IProfile;
  userOrders: any[];
  userKits: any;

  constructor() {
    console.log('App state Contructor called');
  }


  clearData() {
    this.loginState = false;
    this.userProfile = null;
    this.userKits = null;
    this.userOrders = null;
  }
}
