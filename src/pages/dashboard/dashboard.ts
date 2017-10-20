import { IFacetimeRequest } from './../../models/facetimeRequest';
import { Observable } from 'rxjs/Observable';
import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  userProfile: IProfile;
  myrequests: IFacetimeRequest[] = [];
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController,
    public appState: AppStateServiceProvider,
    private afAuth: AngularFireAuth,
    private fDb: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private modelCtrl: ModalController) {
  }

  ionViewWillLoad() {

    this.afAuth.authState.take(1).subscribe(data => {
      if (data && data.uid) {
        const profRef = this.fDb.object(`profiles/${data.uid}`);

        profRef.snapshotChanges().subscribe(profData => {
          this.userProfile = profData.payload.val();
          this.appState.userProfile = this.userProfile;
        });
        //this.userProfile= this.fDb.object(`profiles/${data.uid}`);
      } else {
        console.log(data)
        this.navCtrl.setRoot('WelcomePage');
      }
    });

    let allmyrequests;

    this.fDb.database.ref('/faceTimeRequests').child(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      for (var req in allmyrequests) {
        console.log(allmyrequests[req]);
        this.myrequests.push(allmyrequests[req]);
      }
    });
  }

  loadUsers() {
    const loader = this.loadingCtrl.create(
      {
        content: 'Loading...'
      })
    loader.present()
      .then(() => {
        this.openModel('UserListPage', null);
        loader.dismiss();
      })
  }

  openModel(pageName, userList, ) {
    this.modelCtrl.create(pageName, null, { cssClass: 'inset-modal' })
      .present();
  }


}
