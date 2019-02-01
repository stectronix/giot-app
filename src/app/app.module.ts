import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { ScanQrPage } from '../pages/scan-qr/scan-qr';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { RoutinePage } from '../pages/routine/routine';
import { WorkoutPage } from '../pages/workout/workout';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { AboutPage } from '../pages/about/about';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera } from '@ionic-native/camera';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { ApiProvider } from '../providers/api/api';
import { MatchPasswordProvider } from '../providers/api/match-password';
import { PlanPage } from '../pages/plan/plan';
import { ExercisePage } from '../pages/exercise/exercise';

@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		BluetoothPage,
		ScanQrPage,
		SignupPage,
		HomePage,
		ProfilePage,
		RoutinePage,
		WorkoutPage,
		EditProfilePage,
		AboutPage,
		PlanPage,
		ExercisePage
	],
	imports: [
		BrowserModule,
		HttpModule,
		HttpClientModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		BluetoothPage,
		ScanQrPage,
		SignupPage,
		HomePage,
		ProfilePage,
		RoutinePage,
		WorkoutPage,
		EditProfilePage,
		AboutPage,
		PlanPage,
		ExercisePage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		BLE,
		AndroidPermissions,
		BarcodeScanner,
		InAppBrowser,
		DatePicker,
		Camera,
		ApiProvider,
    	MatchPasswordProvider
  ]
})
export class AppModule {}
