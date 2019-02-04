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
	resposeData2;
	resposeData3;
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
	qr;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public toastCtrl: ToastController,
					public api: ApiProvider,
					private formBuilder: FormBuilder,
					private ble: BLE,
					private alertCtrl: AlertController,
					private ngZone: NgZone) {

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
		if (this.todo.valid && this.routine != null) {
			var data3 ={'id':this.routine.id,
							'cod_categoria':this.resposeData2.cod_categoria,
							'descripcion':this.todo.value.series,
							'repeticion':this.todo.value.repetitions,
							'descanso':this.todo.value.rest,
							'indicacion':this.todo.value.weight,
							'cod_cliente':this.resposeData2['cod_cliente'],
							'cod_maquina':this.resposeData2['cod_maquina'],
							'cod_tipo_ejercicio':this.resposeData2['cod_tipo_ejercicio'],
							'fecha':this.resposeData2['fecha'],
							'planificado':this.resposeData2['planificado'],
							'cod_profesional':this.resposeData2['cod_profesional'],
							'terminada':this.resposeData2['terminada']};
			this.api.putRoutine(data3).then((routine) => {
				this.resposeData3 = routine[0];
				this.navCtrl.push(WorkoutPage,{
					device: this.device,
					series: this.todo.value.series,
					repetitions: this.todo.value.repetitions,
					weight: this.todo.value.weight,
					rest: this.todo.value.rest,
					routine:this.resposeData3
				});
			},(err) => {
				this.showToast(err)
			});
		}else{
			this.navCtrl.push(WorkoutPage,{
				device: this.device,
				series: this.todo.value.series,
				repetitions: this.todo.value.repetitions,
				weight: this.todo.value.weight,
				rest: this.todo.value.rest,
			});
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RoutinePage');
		this.getExercises();
		if (this.select == null && this.barcode != null) {
			this.qr = this.barcode.text;
			console.log('RoutinePage2: ' + this.qr);
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
			var data2 = {'id':this.routine.id};
			console.log('RoutinePage3: ' + JSON.stringify(data2));
			this.api.getRoutine(data2).then((routine) => {
				this.resposeData2 = routine[0];
				console.log('RoutinePage4: ' + JSON.stringify(this.resposeData2));
			},(err) => {
				this.showToast(err);
			});
			this.ngZone.run(() => {
				this.machine = this.routine.maquina;
				this.repeticion = this.routine.repeticion,
				this.serie = this.routine.serie,
				this.peso = this.routine.indicacion,
				this.descanso = this.routine.descanso
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

	getExercises(){
		$.ajax({
			type:'GET',
			contentType: 'application/json',
			dataType: "json",
				crossDomain: true,
			headers: {
				'Content-Type': 'application/json'
			},
			url: "http://giot.cl/panelgym/public/tipoejercicio",
			success: function(dados2)
			{
				var x,y
				for (x=0;x<dados2.length;x++){
					for (y=0;y<dados2[x].length;y++){
						$('#exercise').append($('<option>', {
							value: dados2[x][y].id,
							text : dados2[x][y].descripcion
						}));
					}
				}
			}
		});
	}

	loadSelect(){

	}
}
