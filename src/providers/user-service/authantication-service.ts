import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IProfile } from '../../models/profile';
import { AppStateServiceProvider } from '../app-state-service/app-state-service';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Events } from 'ionic-angular';

@Injectable()
export class AuthanticationServiceProvider {

  constructor(public http: Http,
    public events: Events,
    private afAuth: AngularFireAuth,
    public afDb: AngularFireDatabase,
    public appState: AppStateServiceProvider,
    public loadingCtrl: LoadingController) {
  }


  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<any> {
    this.appState.clearData();
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

  uploadImage(image: string, userId: string): any {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    let storageRef = firebase.storage().ref('profileImages');
    let imageRef = storageRef.child(`${userId}.jpg`);
    return imageRef.putString(image, 'data_url')
      .then(data => {
        if (data) {
          const profRef = this.afDb.object('/profiles/' + userId);
          profRef.update({ profilePicUrl: data.downloadURL });
          this.getUserProfile(userId);
          loadingPopup.dismiss();
        }
      }).catch(error => {
        console.log(error);
        loadingPopup.dismiss();
      })
  }

  getUserProfile(uid) {
    const profRef = this.afDb.object('/profiles/' + uid);
    profRef.snapshotChanges().subscribe(profData => {
      let userProfile = profData.payload.val();
      if (userProfile) {
        this.appState.userProfile = userProfile;
        if (this.appState.userProfile) {
          this.events.publish('profile:recieved', this.appState.userProfile);
        }
      }
    });
  }

  addUserKit(uid, barcode) {
    let kitData = {
      rawDnaData: '',
      intervenstions: '',
      dataRecieved: false
    };

    return this.afDb.object(`userKits/${uid}/${barcode}`).set(kitData).then(data => {
      this.events.publish('userdata:updated', data);
    })
  }
}


