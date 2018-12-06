import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { AboutPage } from '../about/about';

@IonicPage()
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html',
})
export class ProfilePage {

	constructor(public navCtrl: NavController,
					public navParams: NavParams) {
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

	}

}
