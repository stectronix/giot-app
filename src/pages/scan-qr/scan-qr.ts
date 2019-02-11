import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { RoutinePage } from '../routine/routine';
import { ApiProvider } from '../../providers/api/api';

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
