import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
// for auth    
import { AngularFireAuthModule } from 'angularfire2/auth';
// for database
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgCalendarModule  } from 'ionic2-calendar';

import { HomePage, DashboardPage, 
  PreferencesPage, AppointmentsPage, 
  SignupPage, UserListPage, 
  ConfrencePage, ForgotPage, 
  UserProfilePage, AddressPage,
  PersonalInfoPage, HealthInfoPage} from '../pages/pages';

import { AuthanticationServiceProvider,AppStateServiceProvider, 
  ConfrenceServiceProvider, StorageHelperProvider } from '../providers/providers';
import { NativeAudio } from '@ionic-native/native-audio';



var firebaseConfig = {
  apiKey: "AIzaSyABTzyLaNnPgZyX3C-95r1GNhpxKKezJKM",
  authDomain: "synerome-f2748.firebaseapp.com",
  databaseURL: "https://synerome-f2748.firebaseio.com",
  projectId: "synerome-f2748",
  storageBucket: "synerome-f2748.appspot.com",
  messagingSenderId: "355513485520"
};

@NgModule({
  declarations: [
    MyApp,
    ForgotPage,
    SignupPage,
    AddressPage,
    PersonalInfoPage,
    HealthInfoPage,
    UserProfilePage,
    HomePage,
    DashboardPage,
    PreferencesPage,
    AppointmentsPage,
    UserListPage,
    ConfrencePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot({
      name: '__synerDb'
    }),
    HttpModule,
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ForgotPage,
    SignupPage,
    AddressPage,
    PersonalInfoPage,
    HealthInfoPage,
    UserProfilePage,
    HomePage,
    DashboardPage,
    PreferencesPage,
    AppointmentsPage,
    UserListPage,
    ConfrencePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthanticationServiceProvider,
    AppStateServiceProvider,
    ConfrenceServiceProvider,
    NativeAudio,
    StorageHelperProvider
  ]
})
export class AppModule {}