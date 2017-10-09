import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireObject, } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../../models/models';
import { IProfile } from '../../models/profile';
import { AppStateServiceProvider } from '../app-state-service/app-state-service';


@Injectable()
export class AuthanticationServiceProvider {

  constructor(public http: Http,
    private fAuth: AngularFireAuth,
    public fDb: AngularFireDatabase,
    public appState: AppStateServiceProvider) {
  }

  async register(user: IUser) {
    console.log(user);
    this.fAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(data =>{
        console.log('Registered');
        console.log(data);
      })
      .catch(error => {
        console.log(error);
        return false;
      })
  }
  async login(user: IUser) {   
    await this.fAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        this.appState.loginStateSet = true;
        this.appState.userProfile = this.fDb.object(`profiles/${data.uid}`);
        console.log('Service');
      })
  }

  async createProfile(profile: IProfile) {

    this.fDb.object(`profile/${profile.id}`).set(profile)
      .then(data => {
        if (data) {
          this.appState.userProfile = data;
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  async logout(){
    await this.fAuth.auth.signOut();
  }
}
