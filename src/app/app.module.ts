import { BrowserModule } from '@angular/platform-browser';
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

@NgModule({
   declarations: [
   MyApp,
   LoginPage,
   BluetoothPage,
   ScanQrPage,
   SignupPage,
   HomePage
   ],
   imports: [
	 BrowserModule,
	 IonicModule.forRoot(MyApp)
   ],
   bootstrap: [IonicApp],
   entryComponents: [
   MyApp,
   LoginPage,
   BluetoothPage,
   ScanQrPage,
   SignupPage,
   HomePage
   ],
   providers: [
	 StatusBar,
	 SplashScreen,
	 {provide: ErrorHandler, useClass: IonicErrorHandler},
	 BLE,
	 AndroidPermissions
  ]
})
export class AppModule {}
