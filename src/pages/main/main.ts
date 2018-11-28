import { Component,NgZone } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

	peripheral: any = {};
	statusMessage: string;
	repetitions: number;
	pause: boolean;
	sw: number;


	constructor(public navCtrl: NavController, 
				public toastCtrl: ToastController,
				public navParams: NavParams,
				private ble: BLE, 
				private alertCtrl: AlertController,
				private ngZone: NgZone) {

		let device = navParams.get('device');

		if (device == null) { 
			this.showToast('No está conectado');
			this.sw = 0;
		} else {
			this.setStatus('Conectando a ' + device.name || device.id);

			this.ble.connect(device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
		}


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MainPage');
		this.pause = true;
		this.sw = 0;
		console.log(this.pause + ' ' + this.sw);
	}

	ionViewDidLeave(){
		console.log('ionViewDidLeave MainPage');
		this.ble.disconnect(this.peripheral.id);
	}

	play(){
		if (this.pause == true) { 
			this.pause = false;
			this.showToast('PLAY');

			if (this.sw == 1) {
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("1"));
			}
		} else {
			this.pause = true;
			this.showToast('PAUSE');
			if (this.sw == 1) {
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("0"));
			}
		}
	}

	onConnected(peripheral){
		this.peripheral = peripheral;
		this.sw = 1;
		console.log(peripheral.id);
		this.setStatus('Conectado a ' + (peripheral.name || peripheral.id));

		this.ble.startNotification(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC).subscribe(
			data => this.onRepetitionsChange(data),
			() => this.showAlert('Error inesperado', 'Falla al suscribirse al conteo de repeticones')
		);

	}

	// ASCII only
	stringToBytes(string) {
		console.log(string);
		var array = new Uint8Array(2);
		
		array[0] = string.charCodeAt(0);
		console.log(array[0]);

		return array.buffer;
	}

	onRepetitionsChange(buffer: ArrayBuffer){

		var data = new Uint8Array(buffer);

		String.fromCharCode.apply(null, new Uint8Array(data));

		console.log(String.fromCharCode.apply(null, new Uint8Array(data)));

		this.ngZone.run(() => {
			this.repetitions = String.fromCharCode.apply(null, new Uint8Array(data));
		});

	}

	ionViewWillLeave(){
		console.log('Desconectando Bluetooth');
		this.ble.disconnect(this.peripheral.id).then(
			() => console.log('Desconectado ' + JSON.stringify(this.peripheral)),
			() => console.log('ERROR desconectando ' + JSON.stringify(this.peripheral))
		)
	}

	setStatus(message){
		console.log(message);
		this.ngZone.run( ()=>{
			this.statusMessage = message;
		});
	}

	showToast(message){
		let toast = this.toastCtrl.create({
			position: 'middle',
			message: message,
			duration: 2000
		});
		toast.present();
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
