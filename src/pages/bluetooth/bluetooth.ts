import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController,LoadingController,ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

	devices: any[] = [];
  	statusMessage: string;
  	peripheral: any = {};

	constructor(public navCtrl: NavController,
					private loadingController: LoadingController,
					private toastCtrl: ToastController,
					private ble: BLE,
					private ngZone: NgZone) {
  }

	ionViewDidLoad() {
		console.log('ionViewDidLoad BluetoothPage');
	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter: BluetoothPage');
	this.devices = [];
	}

	scan(){
		this.devices = [];
		this.presentLoading();
		this.ble.scan([],5).subscribe(
			device => this.onDeviceDiscovered(device),
			error => this.scanError(error)
		);

		setTimeout(this.setStatus.bind(this),5000,'');
	}

	disconnect(){
		this.ble.isConnected('84:68:3E:03:2C:9B').then(
			success => {
				console.log('Dispositivo 84:68:3E:03:2C:9B está conectado');
				this.ble.disconnect('84:68:3E:03:2C:9B');
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
		console.log(JSON.stringify(device.name) + ' seleccionado');
		this.navCtrl.push(HomePage,{
			device: device
		}).then(() => {
			const index = this.navCtrl.getActive().index;
			this.navCtrl.remove(0,index);
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
		this.navCtrl.push(HomePage).then(() => {
			const index = this.navCtrl.getActive().index;
			this.navCtrl.remove(0,index);
		});
	}

}
