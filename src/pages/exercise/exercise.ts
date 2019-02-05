import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,/*  ToastController,  */AlertController } from 'ionic-angular';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
// import * as $ from "jquery";
import { Observable } from 'rxjs/Observable';
import { BLE } from '@ionic-native/ble';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {

	array: any[];
	array2: any[];
	// private todo: FormGroup;
	getSelectedValue: any;
	getSelectedValue2: any;
	resposeData;
	resposeData2;
	resposeData3;
	resposeData4;
	id;
	machines;
	exercises;
	today;
	cod_categoria;
	repeticion;
	peso;
	descanso;
	series;
	rest;
	timerVar;
	device;
	sw;
	peripheral: any = {};
	countDown;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider,
					private ble: BLE,
					private alertCtrl: AlertController,
					/* private formBuilder: FormBuilder,
					private toastCtrl: ToastController */) {

		// this.todo = this.formBuilder.group({
		// 	// machine: ['', Validators.required],
		// 	// exercise: ['', Validators.required],
		// 	series: ['', Validators.required],
		// 	repetitions: ['', Validators.required],
		// 	weight: ['', Validators.required],
		// 	rest: ['', Validators.required]
		// });
		this.rest = navParams.get('rest');
		this.device = navParams.get('device');

		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		} else {
			console.log('Exercise1: ' + 'Conectando a ' + this.device.name || this.device.id);
			this.ble.connect(this.device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				// peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
		}

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ExercisePage');
	}

	ionViewWillEnter(){
		console.log('Exercise2: ' + this.rest);
		this.timerVar = Observable.interval(1000).subscribe(x => {
			console.log('Exercise3: ' + x);
			if (x == parseInt(this.rest)) {
				this.timerVar.unsubscribe();
				this.navCtrl.pop();
			} else {
				this.countDown = this.rest - x;
			}
		});

		// this.cod_categoria = 1;
		// this.api.getUser().then((user) => {
		// 	var data = {'usuario':user['usuario']};
		// 	this.api.getDataClient(data).then((result) => {
		// 		this.resposeData = result[0];
		// 		this.id = this.resposeData['id'];
		// 	});
		// });
		// this.api.getAllMachines().then((machine) => {
		// 	this.resposeData2 = machine[0];
		// },(err) => {
		// 	this.showToast(err);
		// });
		// this.api.getExercise().then((exercise) => {
		// 	this.resposeData3 = exercise[0];
		// },(err) => {
		// 	this.showToast(err);
		// });

		// var date = new Date()
		// var month = date.getMonth() + 1;
		// if (month < 10) {
		// 	var monthAux = '0' + month;
		// }else{
		// 	monthAux = month.toString();
		// }
		// if(date.getDate() < 10){
		// 	var dayAux = '0' + date.getDate();
		// }else{
		// 	dayAux = date.getDate().toString();
		// }
		// this.today = date.getFullYear().toString() + '-' + monthAux + '-' + dayAux;
		// console.log('Fecha: ',this.today);
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

		//console.log(String.fromCharCode.apply(null, new Uint8Array(data)));

	}

	goBack(){
		this.navCtrl.pop();
	}

	saveRoutine(){
			// var data = JSON.stringify({
			// 				'cod_categoria': 1,
			// 				'descripcion': parseInt(this.todo.value.series),
			// 				'repeticion': parseInt(this.todo.value.repetitions),
			// 				'descanso': parseInt(this.todo.value.rest),
			// 				'indicacion': parseInt(this.todo.value.weight),
			// 				'cod_cliente': parseInt(this.id),
			// 				'cod_maquina': parseInt(this.getSelectedValue),
			// 				'cod_tipo_ejercicio': parseInt(this.getSelectedValue2),
			// 				'fecha': this.today
			// 			});
			// console.log('ExercisePage: ' + JSON.stringify(data));
			// this.api.postSaveExercise(data).then((exercise) => {
			// 	this.resposeData4 = exercise
			// 	this.navCtrl.pop();
			// },(err) => {
			// 	this.showToast(err);
			// });
	}

	showToast(message){
		// let toast = this.toastCtrl.create({
		// 	position: 'middle',
		// 	message: message,
		// 	duration: 2000
		// });
		// toast.present();
	}

	saveCamp(){
		// if (this.todo.valid) {
		// 	this.series = this.todo.value.series;
		// 	this.repeticion = this.todo.value.repetitions;
		// 	this.descanso = this.todo.value.rest;
		// 	this.peso = this.todo.value.weight;
		// 	this.saveRoutine();
		// }
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
