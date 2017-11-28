import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DashboardPage, AppointmentsPage, PreferencesPage, UserProfilePage, LoginPage } from '../pages/pages';
import { AuthanticationServiceProvider } from '../providers/providers';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'LoginPage';
  selectedTheme: string = 'dark-theme';
  menu: Array<any> = [];

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authProvider: AuthanticationServiceProvider
  ) {
    this.initializeApp();
    this.createMenuItems();

    console.log(this.menu);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
        icon: 'calendar',
        name: 'Apponitments',
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
