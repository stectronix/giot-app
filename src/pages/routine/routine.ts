import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkoutPage } from '../workout/workout';
import { BLE } from '@ionic-native/ble';
import { ApiProvider } from '../../providers/api/api';
import * as $ from "jquery";

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
	selector: 'page-routine',
	templateUrl: 'routine.html',
})
export class RoutinePage {

	resposeData;
	select;
	code;
	machine;
	barcode;
	plan;
	private todo: FormGroup;
	exercises: any[] = [];
	getSelectedValue: any;
	array: any;
	peripheral: any = {};
	device;
	sw;
	routine;
	exercise;
	repeticion;
	serie;
	peso;
	descanso;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public toastCtrl: ToastController,
					public api: ApiProvider,
					private formBuilder: FormBuilder,
					private ble: BLE,
					private alertCtrl: AlertController,
					private ngZone: NgZone) {

		$.ajax({
			type:'GET',
			contentType: 'application/json',
			dataType: "json",
				crossDomain: true,
			headers: {
				'Content-Type': 'application/json'
			},
			url: "http://giot.cl/panelgym/public/maquina",
			success: function(dados)
			{
				var i,j
				for (i=0;i<dados.length;i++){
					for (j=0;j<dados[i].length;j++){
						$('#machine').append($('<option>', {
							value: dados[i][j].id,
							text : dados[i][j].descripcion
						}));
					}
				}
			}
		});

		$.ajax({
			type:'GET',
			contentType: 'application/json',
			dataType: "json",
				crossDomain: true,
			headers: {
				'Content-Type': 'application/json'
			},
			url: "http://giot.cl/panelgym/public/tipoejercicio",
			success: function(dados)
			{
				var i,j
				for (i=0;i<dados.length;i++){
					for (j=0;j<dados[i].length;j++){
						$('#exercise').append($('<option>', {
							value: dados[i][j].id,
							text : dados[i][j].descripcion
						}));
					}
				}
			}
		});

		this.select = navParams.get('select');
		this.barcode = navParams.get('barcode');
		this.device = navParams.get('device');
		this.routine = navParams.get('routine');
		this.exercise = navParams.get('exercise');


		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		} else {
			console.log('RoutinePage1: ' + 'Conectando a ' + this.device.name || this.device.id);
			this.ble.connect(this.device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				// peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
		}

		this.todo = this.formBuilder.group({
			// exercise: ['', Validators.required],
			series: ['', Validators.required],
			repetitions: ['', Validators.required],
			weight: ['', Validators.required],
			rest: ['', Validators.required]
		});

	}

	startRoutine(){
		// if (this.todo.valid) {
			this.navCtrl.push(WorkoutPage,{
				device: this.device,
				series: this.todo.value.series,
				repetitions: this.todo.value.repetitions,
				weight: this.todo.value.weight,
				rest: this.todo.value.rest
			});
		// }
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RoutinePage');
		if (this.select == null && this.barcode != null) {
			console.log(this.barcode);
			var data = {'id': this.barcode.text};
			this.api.getMachine(data).then((machine) => {
				this.resposeData = machine[0];
				this.machine = this.resposeData['descripcion']
			},(err) =>{
				this.showToast(err);
			});
			/* this.ngZone.run(() => {
				this.machine = this.barcode.text
			}); */
		} /* else if (this.select != null && this.barcode == null){
			console.log(this.select[0].id + ' ' + this.select[0].descripcion);
			this.ngZone.run(() => {
				this.code = this.select[0].id,
				this.machine = this.select[0].descripcion
			});
		} */else if(this.routine != null){
			/* var data = {'id':this.routine.cod_maquina};
			this.api.getMachine(data).then((machine) => {
				this.resposeData = machine;
				this.machine = this.resposeData[0]['descripcion'];
				console.log('RoutinePage2: ' + JSON.stringify(this.resposeData));
			},(err) => {
				this.showToast(err);
			}); */
			this.ngZone.run(() => {
				// this.machine = this.routine.maquina;
				this.repeticion = this.routine.repeticion,
				this.serie = this.routine.descripcion,
				this.peso = this.routine.indicacion,
				this.descanso = this.routine.descanso
			});
		}

	}

	exerciseSelected(){
		this.array = this.exercises.filter(select => select.id == this.getSelectedValue);
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
