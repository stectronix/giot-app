import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ApiProvider } from '../providers/api/api';
import { BluetoothPage } from '../pages/bluetooth/bluetooth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any;
	constructor(platform: Platform,
					statusBar: StatusBar,
					splashScreen: SplashScreen,
					api: ApiProvider) {

		platform.ready().then(() => {
			api.getUser().then((user) => {
				console.log('user: ' + JSON.stringify(user));
				if (user != null) {
					this.rootPage = BluetoothPage;
					// this.rootPage = PlanPage;
				} else {
					this.rootPage = LoginPage;
				}
			});
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();
		});

	}

}

