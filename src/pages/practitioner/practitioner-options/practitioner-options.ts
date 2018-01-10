import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, App } from 'ionic-angular';
import { IProfile } from '../../../models/models';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../../../providers/providers';
import { LoginPage } from '../../auth/auth';
import { PractitionerProfilePage } from '../practitioner';

@IonicPage()
@Component({
  selector: 'page-practitioner-options',
  templateUrl: 'practitioner-options.html',
})
export class PractitionerOptionsPage {

  menuItems: Array<any> = [];
  userProfImage: string = 'assets/imgs/chatterplace.png';
  user: IProfile;

  constructor(public app: App,
    public navCtrl: NavController,
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
      console.log(page.name);
      this.viewCtrl.dismiss().then(() => {
        this.app.getRootNav().push(page.component).catch(err => console.error(err));
        //this.navCtrl.push(page.component).catch(err => console.error(err)); 
      });
      
    } else if (page.type.startsWith('action')) {
      this.doAction(page.type);
    }

  }
  doAction(action: string) {
    if (action === 'action:logout') {
      this.authProvider.logoutUser();
      //this.navCtrl.popAll();
      this.viewCtrl.dismiss().then(() => {       
        this.navCtrl.setRoot(LoginPage).catch(err => console.error(err));
      });
      

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
        icon: 'person',
        name: 'Profile',
        component: PractitionerProfilePage,
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
