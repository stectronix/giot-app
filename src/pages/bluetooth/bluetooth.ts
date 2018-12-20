import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController,LoadingController,ToastController, NavParams, AlertController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { HomePage } from '../home/home';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

	devices: any[] = [];
  	statusMessage: string;
	peripheral: any = {};
	mobilePatform = 'android';
	device;
	sw;
	bleLoading;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public alertCtrl: AlertController,
					private loadingController: LoadingController,
					private toastCtrl: ToastController,
					private ble: BLE,
					private ngZone: NgZone) {

		this.device = navParams.get('device');

		if (this.device == null) {
			console.log('No está conectado');
			this.sw = 0;
		} else {
			console.log('Conectando a ' + this.device.name || this.device.id);
			this.ble.connect(this.device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				// peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
		}

  }

	ionViewDidLoad() {
		console.log('ionViewDidLoad BluetoothPage');
		this.devices = [];
	}

	initializeBle(){
		this.devices = [];
		if (this.mobilePatform === 'ios') {
			this.presentLoading();
			this.scan();
		} else {
			this.ble.isEnabled().then(() => {
				console.log('Bluetooth is enabled');
				this.presentLoading();
				this.scan();
			},
			() => {
				console.log('Bluetooth is *not* enabled');
				this.ble.enable().then( success =>
					{
						console.log('Bluetooth activado');
						this.presentLoading();
						this.scan();
				},
				failure => {
					this.showToast('Bluetooth no disponible, intente de nuevo');
				});
			});
		}
	}

	scan(){
		this.ble.scan([],5).subscribe(
			device => this.onDeviceDiscovered(device),
			error => this.scanError(error)
		);

		setTimeout(this.showToast.bind(this),5000,'');
	}

	disconnect(){
		if (this.device == null) {
			this.showToast('No se encuentra conectado a ningún dispositivo');
		}else{
			this.ble.isConnected(this.device.id).then(
				success => {
					this.ble.disconnect(this.device.id);
					this.showToast((this.device.name || this.device.id) + ' Desconectado');
				});
		}
	}

	onDeviceDiscovered(device){
		console.log('Descubierto ' + JSON.stringify(device,null,2));
		this.ngZone.run(() => {
			this.devices.push(device);
		});
	}

	onConnected(peripheral){
		this.peripheral = peripheral;
		this.sw = 1;
		console.log(peripheral.id);
		console.log('Conectado a ' + (peripheral.name || peripheral.id));

		this.ble.startNotification(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC).subscribe(
			data => this.onRepetitionsChange(data),
			() => this.showAlert('Error inesperado', 'Falla al suscribirse al conteo de repeticones')
		);

	}

	onRepetitionsChange(buffer: ArrayBuffer){

		var data = new Uint8Array(buffer);

		String.fromCharCode.apply(null, new Uint8Array(data));

		//console.log(String.fromCharCode.apply(null, new Uint8Array(data)));

	}

	scanError(error){
		console.log('Error ' + error);
		let toast = this.toastCtrl.create({
			message: 'Error al escanear dispositivos bluetooth',
			position: 'middle',
			duration: 3000
		});
		toast.present();
	}

	showToast(message){
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
		this.bleLoading = this.loadingController.create({
			spinner: 'hide',
			content: `<img src="../../assets/imgs/icon_giot.png" />`,
			cssClass: 'loading',
			duration: 5000
		});
		this.bleLoading.present();
	}

	skip(){
		if (this.device == null) {
			this.navCtrl.push(HomePage).then(() => {
				const index = this.navCtrl.getActive().index;
				this.navCtrl.remove(0,index);
			});
		} else {
			this.navCtrl.push(HomePage,{
				device: this.device
			}).then(() => {
				const index = this.navCtrl.getActive().index;
				this.navCtrl.remove(0,index);
			});
		}
	}

	showAlert(title,message){
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();
	}

}
