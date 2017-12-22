import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DashboardPage, AppointmentsPage, PreferencesPage, UserProfilePage, LoginPage, ProductListPage, ProductDetailsPage } from '../pages/pages';
import { AuthanticationServiceProvider, AppStateServiceProvider } from '../providers/providers';
import { IProfile } from '../models/models';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'LoginPage';
  selectedTheme: string = 'light-theme';
  menu: Array<any> = [];

  user: IProfile;

  constructor(private platform: Platform,
    public events: Events,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public deeplinks: Deeplinks,
    private authProvider: AuthanticationServiceProvider,
    private appState: AppStateServiceProvider,
  ) {
    this.initializeApp();
    this.createMenuItems();

    console.log(this.menu);

    events.subscribe('profile:recieved', profile => {
      if (profile !== undefined && profile !== "") {
        this.user = profile;
      }
    })

    this.user = this.appState.userProfile;
  }


  initializeApp() {
    this.splashScreen.show();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //ON PLATFORM READY CREATE DEEP LINKS
      this.deeplinks.routeWithNavController(this.nav, {
        '/product-details/:prodName': ProductDetailsPage
      }).subscribe((match) => {
        console.log('Successfully routed', match);
      }, (nomatch) => {
        console.log('Unmatched Route', nomatch);
      });
    });
  }

  openPage(page) {

    if (page.type === 'page') {
      this.nav.setRoot(page.component).catch(err => console.error(err));
    } else if (page.type.startsWith('action')) {
      this.doAction(page.type);
    }
  }

  doAction(action: string) {
    if (action === 'action:logout') {
      this.authProvider.logoutUser();
      this.nav.setRoot(LoginPage).catch(err => console.error(err));
    }
  }
  createMenuItems() {
    this.menu = [
      {
        icon: 'home',
        name: 'Dashboard',
        component: DashboardPage,
        type: 'page'
      },
      {
        icon: 'cart',
        name: 'Shopping',
        component: ProductListPage,
        type: 'page'
      },
      {
        icon: 'calendar',
        name: 'Appointments',
        component: AppointmentsPage,
        type: 'page'
      },
      {
        icon: 'person',
        name: 'Profile',
        component: UserProfilePage,
        type: 'page'
      },
      {
        icon: 'settings',
        name: 'Preference',
        component: PreferencesPage,
        type: 'page'
      },
      {
        icon: 'lock',
        name: 'Logout',
        component: '',
        type: 'action:logout'
      },
    ];
  }
}
