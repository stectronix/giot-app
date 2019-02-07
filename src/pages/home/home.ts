import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ScanQrPage } from '../scan-qr/scan-qr';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { ProfilePage } from '../profile/profile';
import { BLE } from '@ionic-native/ble';
import { ApiProvider } from '../../providers/api/api';
import { PlanPage } from '../plan/plan';
import { PerformancePage } from '../performance/performance';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {

	peripheral: any = {};
	sw: number;
	device;
	infoUser;
	resposeData: any;
	name;
	typeClient;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public toastCtrl: ToastController,
					public alertCtrl: AlertController,
					public api: ApiProvider,
					private ble: BLE) {

		this.device = navParams.get('device');

		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		} else {
			console.log('Conectando a ' + this.device.name || this.device.id);
			this.ble.connect(this.device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				// peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
		}

	}

	ionViewWillEnter(){
		this.api.getUser().then((user) => {
			// console.log('user: ' + JSON.stringify(user));
			var data = {'usuario':user['usuario']};
			this.api.getDataClient(data).then((result) => {
				this.resposeData = result[0];
				this.name = this.resposeData['nombre'];
				switch (parseInt(this.resposeData['cod_tipo_cliente'])) {
					case 1:
						this.typeClient = 'CLIENTE GENERAL';
						break;
					case 2:
						this.typeClient = 'DEPORTISTA';
						break;
					case 3:
						this.typeClient = 'AFICIONADO';
						break;
					default:
						break;
				}
			});
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');
	}

	ionViewWillUnload(){
		console.log('ionViewWillUnload HomePage');
		if (this.device != null) {
			this.ble.disconnect(this.device.id).then(() => {
				console.log('desconectado de ' + this.device.name || this.device.id)
			});
		}
	}

	goToTrain(){
		if (this.device == null) {
			this.navCtrl.push(ScanQrPage);
		} else {
			this.navCtrl.push(ScanQrPage,{
				device: this.device
			})
		}
	}

	GoToPlan(){
		if (this.device == null) {
			this.navCtrl.push(PlanPage);
		} else {
			this.navCtrl.push(PlanPage,{
				device: this.device
			})
		}
	}

	goToLink(){
		if (this.device == null) {
			this.navCtrl.push(BluetoothPage);
		} else {
			this.navCtrl.push(BluetoothPage,{
				device: this.device
			})
		}
	}

	goToPerformance(){
		this.navCtrl.push(PerformancePage);
	}

	goToProfile(){
		this.navCtrl.push(ProfilePage);
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
