import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

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
	icon;
	sw;
	series: number;
	repetitions: number;
	weight;
	timerVar;
	mili = '00';
	sec = '00';
	min = '00';
	contSec = 0;
	contMin = 0;
	array;
	cont = 0;

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
			this.icon = 'icon_play';
			this.series;
			this.repetitions;
			this.weight;
			this.button = 'COMENZAR';;
		});
	}

	play(){
		if (this.pause == 0) {
			this.pause = 1;
			this.startTimer();
			this.ngZone.run(() => {
				this.button = 'PAUSAR';
				this.icon = 'icon_pause';
				this.countRepetitions = 1;
				this.mili;
				this.sec;
				this.min;
			});
			if (this.sw == 1) {
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("1"));
			}
		} else {
			this.pause = 0;
			this.timerVar.unsubscribe();
			this.contSec = 0;
			this.contMin = 0;
			this.ngZone.run(() => {
				this.button = 'COMENZAR';
				this.icon = 'icon_play';
				this.countRepetitions = 1;
				this.mili = '00';
				this.sec = '00';
				this.min = '00';
			});
			if (this.sw == 1) {
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("0"));
			}
		}
	}

	// ASCII only
	stringToBytes(string) {
		console.log(string);
		this.array = new Uint8Array(2);

		this.array[0] = string.charCodeAt(0);
		console.log(this.array[0]);

		return this.array.buffer;
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
		if(parseInt(this.countSeries.toString()) <= parseInt(this.series.toString())) {
			console.log(this.countSeries);
			if (parseInt(this.countRepetitions.toString()) <= parseInt(this.repetitions.toString())) {
				console.log(this.countRepetitions);
				this.ngZone.run(() => {
					this.countRepetitions;
				});
			}else{
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("0"));
				this.showToast('Descanso!!! finalizó las repeticiones en esta serie');
				this.pause = 0;
				this.cont++;
				if (this.cont < 2) {
					this.countSeries++;
				}
				this.timerVar.unsubscribe();
				this.ngZone.run(() => {
					this.button = 'COMENZAR';
					this.icon = 'icon_play'
					this.countRepetitions = 1;
					this.countSeries;
				});
				if(parseInt(this.array[0]) == 48){
					this.countSeries++;
					console.log('arr: ' + this.array[0] + ' serie: ' + this.countSeries);
					this.array[0] = "l";
					console.log('after: ' + this.array[0]);
				}
			}
		}else {
			this.showToast('Felicitaciones!!! finalizó este ejercicio');
			this.pause = 0;
			this.contSec = 0;
			this.contMin = 0;
			this.timerVar.unsubscribe();
				this.ngZone.run(() => {
					this.button = 'COMENZAR';
					this.icon = 'icon_play'
					this.countRepetitions = 1;
					this.mili = '00';
					this.sec = '00';
					this.min = '00';
			});
			if (this.sw == 1) {
				this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("0"));
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

	startTimer(){
		this.timerVar = Observable.interval(10).subscribe(x => {
			if (x.toString().length > 2) {
				this.mili = x.toString().substr(-2,2);
			}
			if (this.mili == '99') {
				this.contSec++;
				if (this.contSec < 10) {
					this.sec = '0' + this.contSec.toString();
				}else if(this.contSec >= 10 && this.contSec < 60){
					this.sec = this.contSec.toString();
				}else{
					this.contSec = 0;
				}
			}
			if (this.sec == '59' && this.mili == '99') {
				this.contMin++;
				if (this.contMin < 10) {
					this.min = '0' + this.contMin.toString();
				}else if(this.contMin >= 10 && this.contMin < 60){
					this.min = this.contMin.toString();
				}else{
					this.contMin = 0;
				}
			}
		});
	}

}
