import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, App } from 'ionic-angular';
import { ScanQrPage } from '../scan-qr/scan-qr';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { ProfilePage } from '../profile/profile';
import { BLE } from '@ionic-native/ble';
import { ApiProvider } from '../../providers/api/api';
import { PlanPage } from '../plan/plan';
import { PerformancePage } from '../performance/performance';

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
					public platform: Platform,
					public app: App,
					private ble: BLE) {

		this.device = navParams.get('device');

		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		}

		platform.registerBackButtonAction(() => {
			let nav = app.getActiveNavs()[0];
			if (nav.canGoBack()){ //Can we go back?
				nav.pop();
			} else {
				const alert = this.alertCtrl.create({
						title: 'Salir',
						message: '¿Está seguro que desea salir de la aplicación?',
						buttons: [{
							text: 'Cancelar',
							role: 'cancel',
							handler: () => {
								console.log('salida de la aplicacion cancelada!');
							}
						},{
							text: 'Salir de la aplicación',
							handler: () => {
								this.platform.exitApp(); // Close this application
							}
						}]
				});
				alert.present();
			}
		});

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
