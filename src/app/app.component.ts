import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProductDetailsPage } from '../pages/consumer/consumer';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'LoginPage';
  //rootPage: any = 'ConfrencePage';
  selectedTheme: string = 'light-theme';


  constructor(private platform: Platform,
    public events: Events,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public deeplinks: Deeplinks,
  ) {
    this.initializeApp();
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
}
