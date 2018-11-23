import { Component,NgZone } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { MainPage } from '../main/main';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
	selector: 'page-home',
  	templateUrl: 'home.html'
})
export class HomePage {

	devices: any[] = [];
  	statusMessage: string;
  	peripheral: any = {};

	constructor(public navCtrl: NavController,
				private androidPermissions: AndroidPermissions,
				private loadingController: LoadingController,
				private toastCtrl: ToastController,
				private ble: BLE,
				private ngZone: NgZone) {

 	}

  	ionViewDidEnter() {
  		console.log('ionViewDidEnter: HomePage');
  		this.devices = [];
  	}

  	ionViewDidLeave(){
  		console.log('ionViewDidLeave: HomePage');
  	}

	scan(){
		this.presentLoading();
		// this.checkPermissions();
		// this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH)
		// this.setStatus('Escaneando Dispositivos Bluetooth');
		this.devices = [];

		this.ble.scan([],5).subscribe(
			device => this.onDeviceDiscovered(device),
			error => this.scanError(error)
		);

		setTimeout(this.setStatus.bind(this),8000,'');
	}

	checkPermissions(){
		var resp: boolean;

		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH).then(
			result => {
				console.log('Permiso? ',result.hasPermissions);
			},
			err => {
				this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH);
				console.log('Permiso? ',err.hasPermissions);
			}
		);

		return resp
	}

	disconnect(){
		this.ble.isConnected('84:68:3E:03:8E:55').then(
			success => {
				console.log('Dispositivo 84:68:3E:03:8E:55 está conectado');
				this.ble.disconnect('84:68:3E:03:8E:55');
				this.setStatus('Auxren Desconectado');
			},
			failure => {
				console.log('No se encuentra conectado a ningún dispositivo');
				this.setStatus('No se encuentra conectado a ningún dispositivo');
			}
		);
	}

	setStatus(message){
		console.log(message);
		// this.ngZone.run(() => {
		// 	this.statusMessage = message;
		// });
		let toast = this.toastCtrl.create({
			message: message,
			position: 'middle',
			duration: 3000
		});
		toast.present();
	}

	onDeviceDiscovered(device){
		console.log('Descubierto ' + JSON.stringify(device,null,2));
		this.ngZone.run(() => {
			this.devices.push(device);
		});
	}

	scanError(error){
		this.setStatus('Error ' + error);
		let toast = this.toastCtrl.create({
			message: 'Error al escanear dispositivos bluetooth',
			position: 'middle',
			duration: 3000
		});
		toast.present();
	}

	deviceSelected(device){
		console.log(JSON.stringify(device) + 'seleccionado');
		this.navCtrl.push(MainPage,{
			device: device
		});
	}

	presentLoading(){
		let bleLoading = this.loadingController.create({
			spinner: 'bubbles',
			content: 'Escaneando dispositivos Bluetooth',
			duration: 10000
		});
		bleLoading.present();
	}

	skip(){
		this.navCtrl.push(MainPage);
	}
	
}
