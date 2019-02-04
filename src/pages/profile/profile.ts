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

	resposeData: any;
	name;
	email;
	birthday;
	weight;
	gender;
	height;
	age;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider) {

	}

	ionViewWillEnter(){
		this.api.getUser().then((user) => {
			// console.log('user: ' + JSON.stringify(user));
			var data = {'usuario':user['usuario']};
			this.api.getDataClient(data).then((result) => {
				this.resposeData = result[0];
				this.name = this.resposeData['nombre'];
				this.email = this.resposeData['email'];
				this.birthday = this.resposeData['fecha_nacimiento'];
				this.weight = this.resposeData['peso'];
				if (this.resposeData['genero'] == '2') {
					this.gender = 'FEMENINO';
				} else {
					this.gender = 'MASCULINO';
				}
				this.height = this.resposeData['altura'];
			});
		});
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
