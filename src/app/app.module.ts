import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { PreferencesPage } from '../pages/preferences/preferences';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { WelcomeToSynerOmePage } from '../pages/welcome-to-synerome/welcome-to-synerome';
import { DNADataPage } from '../pages/dnadata/dnadata';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    PreferencesPage,
    LandingPage,
    LoginPage,
    SignupPage,
    WelcomeToSynerOmePage,
    DNADataPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    PreferencesPage,
    LandingPage,
    LoginPage,
    SignupPage,
    WelcomeToSynerOmePage,
    DNADataPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}