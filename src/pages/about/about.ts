import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser'

@IonicPage()
@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
})
export class AboutPage {

	socialUrls = {
		'website': 'https://www.giot.cl/',
		'facebook': 'https://www.facebook.com/giotfit/',
		'instagram': 'https://www.instagram.com/giot/'
	}

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					private inAppBrowser: InAppBrowser) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AboutPage');
	}

	browseTo(socialMedia){
		this.inAppBrowser.create(this.socialUrls[socialMedia], '_system');
	}

	goBack(){
		this.navCtrl.pop();
	}

}
