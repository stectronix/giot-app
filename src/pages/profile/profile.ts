import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { AboutPage } from '../about/about';
import { ApiProvider } from '../../providers/api/api';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html',
})
export class ProfilePage {

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider) {
	}

	ionViewDidLoad() {
	 console.log('ionViewDidLoad ProfilePage');
	}

	goBack(){
		this.navCtrl.pop();
	}

	goToEditProfile(){
		this.navCtrl.push(EditProfilePage);
	}

	goToAboutGiot(){
		this.navCtrl.push(AboutPage);
	}

	logout(){
		this.api.logout();
		this.navCtrl.setRoot(LoginPage);
		this.navCtrl.popToRoot();
	}

}
