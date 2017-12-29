import { Injectable } from '@angular/core';
import { Events, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppStateServiceProvider } from '../providers';
import { IProfile } from '../../models/models';

@Injectable()
export class UserDataPreloaderProvider {

  userProfile: IProfile;
  userOrders: any;
  userKits: any;
  userData: any;
  private appState: any;

  constructor(public events: Events,
    public afDb: AngularFireDatabase,
    appState: AppStateServiceProvider,
    public loadingCtrl: LoadingController) {
    this.appState = appState;

    events.subscribe('profile:updated', profile => {
      if (profile !== undefined && profile !== "") {
        this.userProfile = profile;
        this.appState.userProfile = profile;
      }
    })
    events.subscribe('profile:updated', kitData => {
      if (kitData) {
        this.userKits = kitData.payload.val();
        if (this.userKits) {
          this.appState.kitData = this.userKits;
        }
      }
    })
  }


  preloadUserData(userId, userEmail): Promise<any> {
    console.log(userId);
    console.log(userEmail);
    return new Promise(resolve => {
      this.getUserProfile(userId).then(profData => {
        console.log('1');
        this.getUserOrders(userEmail).then(orderData => {
          console.log('2');
          this.getUserKits(userId).then(kitData => {
            console.log('3');
            console.log('calling resolve');
            console.log(this.userProfile);
            console.log(this.userOrders);

            this.userData = {
              profile: this.userProfile,
              orders: this.userOrders,
              kits: this.userKits
            };
            return resolve(this.userData);
          }).catch(error => {
            console.log('-3');
            return resolve(error);
          });
        }).catch(error => {
          console.log('-2');
          return resolve(error);
        });
      }).catch(error => {
        console.log('-1');
        return resolve(error);
      });
    });
  }


  getUserProfile(uid): Promise<IProfile> {
    return new Promise(resolve => {
      const profRef = this.afDb.object('/profiles/' + uid);

      profRef.snapshotChanges().subscribe(profData => {
        this.userProfile = profData.payload.val();
        if (this.userProfile) {
          this.appState.userProfile = this.userProfile;
          if (this.appState.userProfile) {
            this.events.publish('profile:recieved', this.appState.userProfile);
          }
          resolve(this.userProfile);
        }
      });
    });
  }

  getUserOrders(email): Promise<any> {
    return new Promise(resolve => {
      const orderRef = this.afDb.list('/Orders/', ref => ref.orderByChild('userMail').equalTo(email)).valueChanges();
      orderRef.subscribe(orderData => {
        if (orderData) {
          this.userOrders = orderData;
          if (orderData) {
            this.appState.userOrders = orderData;
            resolve(this.userOrders);
          }
          else {
            resolve(null);
          }
        }
        else {
          resolve(null);
        }
      });
    });
  }
  getUserKits(uid): Promise<any> {
    return new Promise(resolve => {
      const profRef = this.afDb.object('/userKits/' + uid);
      if (profRef) {
        profRef.snapshotChanges().subscribe(kitData => {
          if (kitData) {
            console.log(kitData)
            this.userKits = kitData.payload.val();
            if (this.userKits) {
              this.appState.userKits = this.userKits;
              resolve(this.userKits);
            }
            else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      } else {
        resolve(null);
      }
    });
  }
}
