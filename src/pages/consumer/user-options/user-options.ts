import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, App } from 'ionic-angular';
import { IProfile } from '../../../models/models';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../../providers/providers';
import { LoginPage } from '../../auth/auth';
import { ProductListPage, UserProfilePage, PreferencesPage, ConsumerAppointmentsPage } from '../consumer';
import { HealthPage } from '../../pages';

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
    public app: App,
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
      this.viewCtrl.dismiss().then(() => {
        console.log(this.app.getRootNav());
        this.app.getRootNav().push(page.component).catch(err => console.error(err));
      });
    } else if (page.type.startsWith('action')) {
      this.doAction(page.type);
    }
  }
  doAction(action: string) {
    if (action === 'action:logout') {
      this.authProvider.logoutUser();
      this.viewCtrl.dismiss().then(() => {
        console.log(this.app.getRootNav());
        this.app.getRootNav().push(LoginPage).catch(err => console.error(err));
      });
      //this.navCtrl.setRoot(LoginPage).catch(err => console.error(err));
      //this.navCtrl.popToRoot();
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
        component: ConsumerAppointmentsPage,
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
