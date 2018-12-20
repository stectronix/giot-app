import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ApiProvider {

	apiUrl = 'http://200.24.13.60/~program1/panelgym/public/iniciarsesion';
	isLoggedIn: Boolean;
	user: any;

	constructor(public http: HttpClient,
					public storage: Storage) {
		console.log('Hello ApiProvider Provider');
		console.log(this.user);
	}

	postData(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl,credentials).subscribe(data => {
				console.log(data);
			  	resolve(data);
			}, (err) => {
			  console.log(err);
			  reject(err);
			});
		 });
	}

	login(user) {
		console.log('ApiProviderLogin');
		return this.storage.set('user', user).then(() => {
			this.isLoggedIn = true;
			this.user = user;
		});
	}

	logout(){
		console.log('ApiProviderLogout');
		this.storage.remove('user').then(() => {
			this.isLoggedIn = false;
			this.user = null;
		});
	}

	isAuthenticated() {
		console.log('ApiProviderIsAuthenticated');
		return this.isLoggedIn;
	}

	getUser() {
		console.log('ApiProviderGetUser');
		return this.storage.get('user');
	}

}
