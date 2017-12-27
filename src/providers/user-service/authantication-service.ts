import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IProfile } from '../../models/profile';
import { AppStateServiceProvider } from '../app-state-service/app-state-service';


@Injectable()
export class AuthanticationServiceProvider {

  constructor(public http: Http,
    private afAuth: AngularFireAuth,
    public afDb: AngularFireDatabase,
    public appState: AppStateServiceProvider) {
  }


  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<any> {
    this.appState.setLoginState(false);
    this.appState.setUserProfile(null);
    return this.afAuth.auth.signOut();


  }

  registerUser(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);  
  }

  updateUserProfile(userProfile: IProfile, uid: string): Promise<any> {
    return this.afDb.object(`profiles/${uid}`).set(userProfile);
  }

  deleteUserProfile(uid: string): Promise<any> {
    return this.afDb.object(`profiles/${uid}`).remove();
  }

}


