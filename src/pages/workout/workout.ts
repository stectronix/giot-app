import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
	selector: 'page-workout',
	templateUrl: 'workout.html',
})
export class WorkoutPage {

	peripheral: any = {};
	button;
	countRepetitions: number;
	countSeries: number = 1;
	pause;
	sw;
	series: number;
	repetitions: number;
	weight;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public toastCtrl: ToastController,
					private ble: BLE,
					private alertCtrl: AlertController,
					private ngZone: NgZone) {

		let device = navParams.get('device');
		this.series = navParams.get('series');
		this.repetitions = navParams.get('repetitions');
		this.weight = navParams.get('weight');

		if (device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		} else {
			console.log('Conectando a ' + device.name || device.id);

			this.ble.connect(device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad WorkoutPage');
		this.pause = 0;
		this.sw = 0;
		console.log(this.pause + ' ' + this.sw);
		this.ngZone.run(() => {
			this.series
			this.repetitions
			this.weight
			this.button = 'COMENZAR';
		});
	}

	play(){
		if (this.pause == 0) {
			this.pause = 1;
			this.ngZone.run(() => {
				this.button = 'PAUSAR';
			});
			if (this.sw == 1) {
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("1"));
			}
		} else {
			this.pause = 0;
			this.ngZone.run(() => {
				this.button = 'COMENZAR';
			});
			if (this.sw == 1) {
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("0"));
			}
		}
	}

	// ASCII only
	stringToBytes(string) {
		console.log(string);
		var array = new Uint8Array(2);

		array[0] = string.charCodeAt(0);
		console.log(array[0]);

		return array.buffer;
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
		this.countRepetitions = String.fromCharCode.apply(null, new Uint8Array(data));

		for (let j = 1; j <= this.repetitions; j++) {
			if (this.countRepetitions.valueOf() == j) {
				console.log('repeticiones: ' + this.countRepetitions);
				this.ngZone.run(() => {
					this.countRepetitions;
				});
			}
			if(j > this.repetitions){
				this.showToast('Descanso!!! repeticiones terminadas en esta serie');
			}
		}

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
