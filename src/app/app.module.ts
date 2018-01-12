import { ConfrencePageModule } from './../pages/shared/confrence/confrence.module';
import { SharedUtilsProvider } from './../providers/shared-utils/shared-utils';
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
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import {
  AuthanticationServiceProvider, AppStateServiceProvider, UserDataPreloaderProvider,
  ConfrenceServiceProvider, StorageHelperProvider, ImageProvider
} from '../providers/providers';
import { NativeAudio } from '@ionic-native/native-audio';
import { PayPal } from '@ionic-native/paypal';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Health } from '@ionic-native/health';
import { Camera } from '@ionic-native/camera';
import {
  ForgotPage, SignupTypePage, ConsumerSignupPage,
  ConsumerConditionsPage, EmailVerificationPage, ConsumerProfilePage,
  PractitionerSignupPage, PractitionerConditionsPage, DemographicPage,
  PersonalInfoPage, HealthInfoPage
} from '../pages/auth/auth';
import {
  UserProfilePage, ConsumerDashboardPage,
  PreferencesPage, ProductListPage, ProductDetailsPage,
  CartPage, OrderFinalPage, AddressPage, AddressListPage,
  RegisterKitPage, UserOptionsPage, ConsumerAppointmentsPage
} from '../pages/consumer/consumer';

import {HealthPage } from '../pages/pages';
import { UserListPage, CallControlBoxPage } from '../pages/shared/shared';

import { PractitionerTabsPage, PractitionerOptionsPage,
   PractitionerAppointmentsPage, PractitionerProfilePage, 
   PatientsPage, NotificationPage } from '../pages/practitioner/practitioner';

import { NgCalendarModule } from 'ionic2-calendar/calendar.module';



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
    SignupTypePage,
    ConsumerSignupPage,
    ConsumerConditionsPage,
    EmailVerificationPage,
    ConsumerProfilePage,
    PractitionerSignupPage,
    PractitionerConditionsPage,
    DemographicPage,
    PersonalInfoPage,
    HealthInfoPage,
    UserProfilePage,
    ConsumerDashboardPage,
    PreferencesPage,
    ConsumerAppointmentsPage,
    ProductListPage,
    ProductDetailsPage,
    CartPage,
    OrderFinalPage,
    AddressPage,
    AddressListPage,
    UserListPage,
    HealthPage,
    RegisterKitPage,
    UserOptionsPage,
    CallControlBoxPage,

    PractitionerTabsPage,
    PractitionerOptionsPage,
    PractitionerProfilePage,
    PatientsPage,
    PractitionerAppointmentsPage,
    NotificationPage
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
    NgCalendarModule,
    HttpModule,

    ConfrencePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ForgotPage,
    SignupTypePage,
    ConsumerSignupPage,
    ConsumerConditionsPage,
    EmailVerificationPage,
    ConsumerProfilePage,
    PractitionerSignupPage,
    PractitionerConditionsPage,
    DemographicPage,
    PersonalInfoPage,
    HealthInfoPage,
    UserProfilePage,
    ConsumerDashboardPage,
    PreferencesPage,
    ConsumerAppointmentsPage,
    ProductListPage,
    CartPage,
    OrderFinalPage,
    AddressPage,
    AddressListPage,
    ProductDetailsPage,
    UserListPage,
    HealthPage,
    RegisterKitPage,
    UserOptionsPage,
    CallControlBoxPage,

    PractitionerTabsPage,
    PractitionerOptionsPage,
    PractitionerProfilePage,
    PatientsPage,
    PractitionerAppointmentsPage,
    NotificationPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthanticationServiceProvider,
    AppStateServiceProvider,
    UserDataPreloaderProvider,
    ConfrenceServiceProvider,
    NativeAudio,
    StorageHelperProvider,
    PayPal,
    Deeplinks,
    SocialSharing,
    Health,
    Camera,
    ImageProvider,
    BarcodeScanner,
    UserDataPreloaderProvider,
    SharedUtilsProvider
  ]
})
export class AppModule { }