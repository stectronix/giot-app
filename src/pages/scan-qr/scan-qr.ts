import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { RoutinePage } from '../routine/routine';
import { BLE } from '@ionic-native/ble';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
	selector: 'page-scan-qr',
	templateUrl: 'scan-qr.html',
})
export class ScanQrPage {

	result: BarcodeScanResult;
	machines: any[] = [];
	getSelectedValue: any;
	array: any[];
	peripheral: any = {};
	device;
	sw;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					private barcode: BarcodeScanner,
					private ble: BLE,
					private alertCtrl: AlertController,
					public toastCtrl: ToastController) {

		this.machines = [
			{
				'code': '01',
				'name': 'Prensa 45°'
			},
			{
				'code': '02',
				'name': 'Banco Scott'
			},
			{
				'code': '03',
				'name': 'Multifuncional'
			},
			{
				'code': '04',
				'name': 'Polea'
			},
			{
				'code': '05',
				'name': 'Jaula'
			},
			{
				'code': '06',
				'name': 'Camilla Femoral'
			},
		]

		this.device = navParams.get('device');

		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		} else {
			console.log('Conectando a ' + this.device.name || this.device.id);
			this.ble.connect(this.device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
		}

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ScanQrPage');
	}

	async scanBarcode(){
		try {
			const option: BarcodeScannerOptions = {
				prompt: 'Coloque la cámara frente al QR',
				torchOn: false
			}
			this.result = await this.barcode.scan(option);
			this.navCtrl.push(RoutinePage,{
				barcode: this.result
			});
		} catch (error) {
			console.error(error);
		}
	}

	machineSelected(){
		this.array = this.machines.filter(select => select.code == this.getSelectedValue);
		console.log('id es ' + this.getSelectedValue);
		console.log('valor es ' + this.array[0].name);
	}

	goToRoutine(){
		if (this.array == null) {
			this.showToast('Debe seleccionar una máquina o escanear el QR');
		} else {
			console.log(this.array[0].code + ' ' + this.array[0].name)
			this.navCtrl.push(RoutinePage,{
				select: this.array,
				device: this.device
			});
		}
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

		console.log(String.fromCharCode.apply(null, new Uint8Array(data)));

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
