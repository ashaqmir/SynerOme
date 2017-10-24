import { IFacetimeRequest } from './../../models/facetimeRequest';
import { Observable } from 'rxjs/Observable';
import { IProfile } from './../../models/profile';
import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppStateServiceProvider } from '../../providers/app-state-service/app-state-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IFacetimeRequestView } from '../../models/models';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  userProfile: IProfile;
  chatRequestsToMe: IFacetimeRequestView[] = [];
  chatRequestsByMe: IFacetimeRequestView[] = [];
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
    this.chatRequestsToMe = [];
    this.chatRequestsByMe = [];
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

    let allrequeststome;
    this.fDb.database.ref('/faceTimeRequests').orderByChild('idTo').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
      allrequeststome = snapshot.val();
      console.log
      this.chatRequestsToMe = [];
      for (var req in allrequeststome) {
        console.log(req);
        //this.chatRequestsToMe.push(allrequeststome[req]);
        var request = allrequeststome[req]
        request.key = req;
        this.chatRequestsToMe.push(request);
      }
    });

    let allrequestsbyme;
    this.fDb.database.ref('/faceTimeRequests').orderByChild('idFrom').equalTo(this.afAuth.auth.currentUser.uid).on('value', (snapshot) => {
      allrequestsbyme = snapshot.val();
      this.chatRequestsByMe = []
      for (var req in allrequestsbyme) {
        //this.chatRequestsToMe.push(allrequestsbyme[req]);
        console.log(req);
        var request = allrequestsbyme[req]
        request.key = req;
        this.chatRequestsByMe.push(request);
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

  callToDoctor(personname) {
    console.log('Calling to: ' + personname);
  }

  acceptCall(requestKey) {
    //let allmyrequeststome = [];
    console.log(requestKey + ' ' + this.chatRequestsToMe.length);

    let request = this.chatRequestsToMe.find(req => req.key === requestKey);
    console.log(JSON.stringify(request));
    if (request) {

      const reqToUpdate: IFacetimeRequest = {
        idFrom: request.idFrom,
        idTo: request.idTo,
        nameFrom: request.nameFrom,
        nameTo: request.nameTo,
        status: 'accepted',
      };

      this.fDb.object(`/faceTimeRequests/${requestKey}`).update(reqToUpdate);

    }
    // this.fDb.database.ref('/faceTimeRequests').orderByChild('idTo').equalTo(idTo).once('value', (snapshot) => {
    //   allmyrequeststome = snapshot.val();
    //   for (var req in allmyrequeststome) {
    //     var request = allmyrequeststome[req];
    //     if (req == requestKey) {
    //       request.status = 'accepted';
    //       this.fDb.object(`/faceTimeRequests/${req}`).update(request);
    //       console.log(req);
    //       // request.set({ status: 'accepted' });
    //     }
    //   }
    // });
  }
  deleteCallReq(requestKey) {

    console.log(requestKey + ' ' + this.chatRequestsToMe.length);

    let request = this.chatRequestsToMe.find(req => req.key === requestKey);
    console.log(JSON.stringify(request));
    if (request) {

      const reqToUpdate: IFacetimeRequest = {
        idFrom: request.idFrom,
        idTo: request.idTo,
        nameFrom: request.nameFrom,
        nameTo: request.nameTo,
        status: 'deleted',
      };

      this.fDb.object(`/faceTimeRequests/${requestKey}`).update(reqToUpdate);

      // let allmyrequeststome = [];
      // this.fDb.database.ref('/faceTimeRequests').orderByChild('idTo').equalTo(idTo).once('value', (snapshot) => {
      //   allmyrequeststome = snapshot.val();
      //   for (var req in allmyrequeststome) {
      //     var request = allmyrequeststome[req];
      //     if (request.idTo == idTo && request.idFrom == idFrom) {
      //       request.status = 'deleted';
      //       this.fDb.object(`/faceTimeRequests/${req}`).update(request);
      //       console.log(req);
      //       // request.set({ status: 'accepted' });
      //     }
      //   }
      // });
    }
  }

  
}
