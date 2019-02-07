import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the PerformancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-performance',
	templateUrl: 'performance.html',
})
export class PerformancePage {

	selectedDate;
	resposeData;
	resposeData2;
	resposeData3;
	id;
	machines;
	array;
	getSelectedValue;
	performances;

	constructor(public navCtrl: NavController,
							public navParams: NavParams,
							public api: ApiProvider,
							public toastCtrl: ToastController) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PerformancePage');
		this.api.getUser().then((user) => {
			var data = {'usuario':user['usuario']};
			this.api.getDataClient(data).then((result) => {
				this.resposeData = result[0];
				this.id = this.resposeData['id'];
			});
		});
		this.api.getAllMachines().then((machines) => {
			this.resposeData2 = machines[0];
			this.machines = this.resposeData2;
		});
	}

	machineSelected(){
		this.array = this.machines.filter(select => select.id == this.getSelectedValue);
		console.log('id es ' + this.getSelectedValue);
		console.log('valor es ' + this.array[0].descripcion);
		var data2 = {'cod_maquina':this.getSelectedValue,'cod_cliente':this.id}
		this.api.getPerformance(data2).then((result) =>{
			this.resposeData3 = result[0]
			this.performances = this.resposeData3;
		},(err) => {
			this.showToast(err);
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
}
