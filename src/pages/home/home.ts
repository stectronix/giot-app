import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScanQrPage } from '../scan-qr/scan-qr';
import { BluetoothPage } from '../bluetooth/bluetooth';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');
	}

	goToTrain(){
		this.navCtrl.push(ScanQrPage);
	}

	GoToPlan(){

	}

	goToLink(){
		this.navCtrl.push(BluetoothPage);
	}
}
