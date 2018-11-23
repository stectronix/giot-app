import { Component,NgZone,Input } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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

	constructor(public navCtrl: NavController, 
					public navParams: NavParams,
					private ble: BLE, 
					private alertCtrl: AlertController,
					private ngZone: NgZone) {

		let device = navParams.get('device');

		this.setStatus('Conectando a ' + device.name || device.id);

		this.ble.connect(device.id).subscribe(
			peripheral => this.onConnected(peripheral),
			peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
		);

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MainPage');
	}

	ionViewDidLeave(){
		console.log('ionViewDidLeave MainPage');
		this.ble.disconnect(this.peripheral.id);
	}

	onConnected(peripheral){
		this.peripheral = peripheral;
		console.log(peripheral.id);
		this.setStatus('Conectado a ' + (peripheral.name || peripheral.id));

		this.ble.startNotification(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC).subscribe(
			data => this.onRepetitionsChange(data),
			() => this.showAlert('Error inesperado', 'Falla al suscribirse al conteo de repeticones')
		);

		this.ble.write(this.peripheral.id, REPETITIONS_SERVICE, REPETITIONS_CHARACTERISTIC, this.stringToBytes("1"));

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

	showAlert(title,message){
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();
	}

}
