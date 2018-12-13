import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthServiceProvider {

	private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');

	constructor(public http: HttpClient) {
		console.log('Hello AuthServiceProvider Provider');
	}

	setLoggedIn(value: boolean){
		this.loggedInStatus = value;
		localStorage.setItem('loggedIn', 'true');
	}

	get isLoggedIn(){
		return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
	}

}
