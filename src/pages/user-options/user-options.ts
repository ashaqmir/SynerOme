import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { AppointmentsPage, PreferencesPage, UserProfilePage, LoginPage, ProductListPage, HealthPage } from '../pages';
import { IProfile } from '../../models/models';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-user-options',
  templateUrl: 'user-options.html',
})
export class UserOptionsPage {

  menuItems: Array<any> = [];
  userProfImage: string = 'assets/imgs/chatterplace.png';
  user: IProfile;

  constructor(public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private authProvider: AuthanticationServiceProvider,
    private appState: AppStateServiceProvider) {

    events.subscribe('profile:recieved', profile => {
      if (profile !== undefined && profile !== "") {
        this.user = profile;
        if (this.user && this.user.profilePicUrl) {
          this.userProfImage = this.user.profilePicUrl;
        }
      }
    })

    this.user = this.appState.userProfile;
    if (this.user && this.user.profilePicUrl) {
      this.userProfImage = this.user.profilePicUrl;
    }

    this.createMenuItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserOptionsPage');
  }
  openPage(page) {
    if (page.type === 'page') {
      this.updateActive();
      page.isActive = true;
      this.navCtrl.push(page.component).catch(err => console.error(err));
      this.viewCtrl.dismiss();
    } else if (page.type.startsWith('action')) {
      this.doAction(page.type);
    }
  }
  doAction(action: string) {
    if (action === 'action:logout') {
      this.authProvider.logoutUser();
      //this.navCtrl.popAll();
      this.navCtrl.setRoot(LoginPage).catch(err => console.error(err));
      this.navCtrl.popToRoot();
    }
  }

  updateActive() {
    this.menuItems.forEach(page => {
      page.isActive = false;
    })
  }

  createMenuItems() {
    this.menuItems = [
      {
        icon: 'cart',
        name: 'Shopping',
        component: ProductListPage,
        type: 'page',
        isActive: false
      },
      {
        icon: 'calendar',
        name: 'Appointments',
        component: AppointmentsPage,
        type: 'page',
        isActive: false
      },
      {
        icon: 'bicycle',
        name: 'Health',
        component: HealthPage,
        type: 'page',
        isActive: false
      },
      {
        icon: 'person',
        name: 'Profile',
        component: UserProfilePage,
        type: 'page',
        isActive: false
      },
      {
        icon: 'settings',
        name: 'Preference',
        component: PreferencesPage,
        type: 'page',
        isActive: false
      },
      {
        icon: 'lock',
        name: 'Logout',
        component: '',
        type: 'action:logout',
        isActive: false
      },
    ];
  }
}
