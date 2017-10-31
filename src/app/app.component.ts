import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppStateServiceProvider } from '../providers/app-state-service/app-state-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = 'LoginPage';
  selectedTheme: string= 'dark-theme';

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private appState: AppStateServiceProvider
    ) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
