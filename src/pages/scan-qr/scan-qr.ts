import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { RoutinePage } from '../routine/routine';
import { BLE } from '@ionic-native/ble';
import { ApiProvider } from '../../providers/api/api';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
	selector: 'page-scan-qr',
	templateUrl: 'scan-qr.html',
})
export class ScanQrPage {

	result: BarcodeScanResult;
	resposeData: any;
	machines: any[] = [];
	getSelectedValue: any;
	array;
	peripheral: any = {};
	device;
	sw;
	aux;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public toastCtrl: ToastController,
					public api: ApiProvider,
					private barcode: BarcodeScanner,
					private ble: BLE,
					private alertCtrl: AlertController) {

		this.device = navParams.get('device');

		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ScanQrPage');
		this.api.getAllMachines().then((machines) => {
			this.resposeData = machines[0];
			this.machines = this.resposeData;
		});
	}

	async scanBarcode(){
		try {
			const option: BarcodeScannerOptions = {
				prompt: 'Coloque la cámara frente al QR',
				torchOn: false
			}
			this.result = await this.barcode.scan(option);
			this.navCtrl.push(RoutinePage,{
				barcode: this.result,
				device: this.device
			});
		} catch (error) {
			console.error(error);
		}
	}

	goToRoutine(){
		if (this.array != null) {
			this.navCtrl.push(RoutinePage,{
				select: this.array,
				device: this.device
			});
		}else{
			this.showToast('Debe seleccionar máquina o escanear QR');
		}
	}

	machineSelected(){
		this.array = this.machines.filter(select => select.id == this.getSelectedValue);
		console.log('id es ' + this.getSelectedValue);
		console.log('valor es ' + this.array[0].descripcion);
	}

	showToast(message){
		console.log(message);
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
