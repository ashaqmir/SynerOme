import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { IProfile } from '../../models/profile';


@Injectable()
export class AppStateServiceProvider {

  loginState: boolean = false;
  userProfile: IProfile;

  localStorageProfile: IProfile;
  userOrders: any[];
  userKits: any;
  currentView: string;
  constructor(public events: Events) {
    console.log('App state Contructor called');
    this.events.subscribe('viewLoaded', data => {
      this.currentView = data.viewName;
      console.log(this.currentView);
    });
  }


  clearData() {
    this.loginState = false;
    this.userProfile = null;
    this.userKits = null;
    this.userOrders = null;
  }
}
