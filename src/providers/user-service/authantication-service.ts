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

  async login(user: IUser) {   
    await this.fAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  async logout(){
    await this.fAuth.auth.signOut();
  }
}
