import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ApiProvider {

	apiUrl = 'http://giot.cl/panelgym/public/';
	isLoggedIn: Boolean;
	user: any;

	constructor(public http: HttpClient,
					public storage: Storage) {
		console.log('Hello ApiProvider Provider');
		console.log('api1: ', this.user);
	}

	postLogin(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'iniciarsesioncliente',credentials).subscribe(data => {
				console.log('api2: ', JSON.stringify(data));
			  	resolve(data);
			}, (err) => {
			  console.log('api3: ', JSON.stringify(err));
			  reject(err);
			});
		 });
	}

	postSignup(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'ingresarcliente', credentials).subscribe(data => {
				console.log('api4: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api5: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	postUpdateProfile(credentials){
		return new Promise((resolve,reject) => {
			this.http.put(this.apiUrl + 'actualizarcliente', credentials).subscribe(data => {
				console.log('api6: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api7: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	getDataClient(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'obtenersesioncliente', credentials).subscribe(data => {
				console.log('api8: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api9: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	getMachine(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'obtenermaquina', credentials).subscribe(data => {
				console.log('api10: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api11: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	getAllMachines(){
		return new Promise((resolve,reject) => {
			this.http.get(this.apiUrl + 'maquina').subscribe(data => {
				console.log('api12: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api13: ', JSON.stringify(err));
				reject(err);
			});
		});
	}


	checkExistUser(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'obtenerexistenciacliente', credentials).subscribe(data => {
				console.log('api14: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api15: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	login(user) {
		console.log('api16: ', 'ApiProviderLogin');
		return this.storage.set('user', user).then(() => {
			this.isLoggedIn = true;
			this.user = user;
		});
	}

	logout(){
		console.log('api17: ', 'ApiProviderLogout');
		this.storage.remove('user').then(() => {
			this.isLoggedIn = false;
			this.user = null;
		});
	}

	isAuthenticated() {
		console.log('api18: ', 'ApiProviderIsAuthenticated');
		return this.isLoggedIn;
	}

	getUser() {
		console.log('api19: ', 'ApiProviderGetUser');
		return this.storage.get('user');
	}

	getExerciseClient(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'ejerciciocliente', credentials).subscribe(data => {
				console.log('api20: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api21: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	getTypeExercise(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'obtenertipoejercicio', credentials).subscribe(data => {
				console.log('api22: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api23: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	postSaveExercise(credentials){
		return new Promise((resolve,reject) => {
			this.http.post(this.apiUrl + 'ingresarejercicio', credentials).subscribe(data => {
				console.log('api24: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api25: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

	getExercise(){
		return new Promise((resolve,reject) => {
			this.http.get(this.apiUrl + 'tipoejercicio').subscribe(data => {
				console.log('api26: ', JSON.stringify(data));
				resolve(data);
			}, (err) => {
				console.log('api27: ', JSON.stringify(err));
				reject(err);
			});
		});
	}

}
