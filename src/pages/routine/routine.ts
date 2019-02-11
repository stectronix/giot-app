import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkoutPage } from '../workout/workout';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
	selector: 'page-routine',
	templateUrl: 'routine.html',
})
export class RoutinePage {

	resposeData;
	resposeData2;
	resposeData3;
	resposeData4;
	resposeData5;
	resposeData6;
	resposeData7;
	select;
	code;
	machine;
	barcode;
	plan;
	private todo: FormGroup;
	exercises: any[] = [];
	getSelectedValue: any;
	array;
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
	id;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public toastCtrl: ToastController,
					public api: ApiProvider,
					private formBuilder: FormBuilder,
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
		}

		this.todo = this.formBuilder.group({
			exercise: ['', Validators.required],
			series: ['', Validators.required],
			repetitions: ['', Validators.required],
			weight: ['', Validators.required],
			rest: ['', Validators.required]
		});

	}

	startRoutine(){
		if (this.todo.valid && this.routine != null && this.barcode == null && this.select == null) {
			var data6 ={'id':this.routine.id,
							'cod_categoria':this.resposeData4.cod_categoria,
							'descripcion':this.todo.value.series,
							'repeticion':this.todo.value.repetitions,
							'descanso':this.todo.value.rest,
							'indicacion':this.todo.value.weight,
							'cod_cliente':this.resposeData4['cod_cliente'],
							'cod_maquina':this.resposeData4['cod_maquina'],
							'cod_tipo_ejercicio':this.getSelectedValue,
							'fecha':this.resposeData4['fecha'],
							'planificado':this.resposeData4['planificado'],
							'cod_profesional':this.resposeData4['cod_profesional'],
							'terminada':this.resposeData4['terminada']};
			this.api.putRoutine(data6).then((routine) => {
				this.resposeData6 = routine[0];
				this.navCtrl.push(WorkoutPage,{
					device: this.device,
					series: this.todo.value.series,
					repetitions: this.todo.value.repetitions,
					weight: this.todo.value.weight,
					rest: this.todo.value.rest,
					routine:this.resposeData6
				});
			},(err) => {
				this.showToast(err)
			});
		}else if(this.getSelectedValue != null){
			var date = new Date()
			var month = date.getMonth() + 1;
			if (month < 10) {
				var monthAux = '0' + month;
			}else{
				monthAux = month.toString();
			}
			if(date.getDate() < 10){
				var dayAux = '0' + date.getDate();
			}else{
				dayAux = date.getDate().toString();
			}
			var today = date.getFullYear() + '-' + monthAux + '-' + dayAux;
			this.api.getUser().then((user) => {
				var data7 = {'usuario':user['usuario']};
				this.api.getDataClient(data7).then((result) => {
					this.resposeData7 = result[0];
					this.id = this.resposeData7['id'];
					if (this.select != null) {
						var cod_maquina = this.select[0].id
					} else {
						cod_maquina = this.barcode.text
					}
					var data5 ={'cod_categoria':1,
							'descripcion':this.todo.value.series,
							'repeticion':this.todo.value.repetitions,
							'descanso':this.todo.value.rest,
							'indicacion':this.todo.value.weight,
							'cod_cliente':this.id,
							'cod_maquina':cod_maquina,
							'cod_tipo_ejercicio':this.getSelectedValue,
							'fecha':today,
							'planificado':0,
							'cod_profesional':0,
							'terminada':0};
					this.api.postSaveExercise(data5).then((exercise) => {
						this.resposeData5 = exercise[0];
					},(err) => {
						this.showToast(err)
					});
					this.navCtrl.push(WorkoutPage,{
						device: this.device,
						series: this.todo.value.series,
						repetitions: this.todo.value.repetitions,
						weight: this.todo.value.weight,
						rest: this.todo.value.rest,
					});
				});
			});
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RoutinePage');
		if (this.select == null && this.barcode != null && this.routine == null) {
			this.qr = this.barcode.text;
			console.log('RoutinePage2: ' + this.qr);
			var data = {'id': this.barcode.text};
			this.api.getMachine(data).then((machine) => {
				this.resposeData = machine[0];
				this.machine = this.resposeData['descripcion']
				var data2 = {'cod_maquina': this.barcode.text}
				this.api.getExerciseByMachine(data2).then((exercise) => {
					this.resposeData2 = exercise[0];
					this.exercises = this.resposeData2
				},(err) => {
					this.showToast(err);
				});
			},(err) =>{
				this.showToast(err);
			});
		} else if (this.select != null && this.barcode == null && this.routine == null){
			console.log(this.select[0].id + ' ' + this.select[0].descripcion);
			this.ngZone.run(() => {
				this.machine = this.select[0].descripcion
			});
			var data3 = {'cod_maquina': this.select[0].id}
				this.api.getExerciseByMachine(data3).then((exercise) => {
					this.resposeData3 = exercise[0];
					this.exercises = this.resposeData3
				},(err) => {
					this.showToast(err);
			});
		}else if(this.routine != null && this.barcode == null && this.select == null){
			var data4 = {'id':this.routine.id};
			this.api.getRoutine(data4).then((routine) => {
				this.resposeData4 = routine[0];
				var data5 = {'cod_maquina': this.resposeData4['cod_maquina']}
				this.api.getExerciseByMachine(data5).then((exercise) => {
					this.resposeData5 = exercise[0];
					this.exercises = this.resposeData5
					this.ngZone.run(() => {
						this.machine = this.routine.maquina;
						this.repeticion = this.routine.repeticion,
						this.serie = this.routine.descripcion,
						this.peso = this.routine.indicacion,
						this.descanso = this.routine.descanso,
						this.getSelectedValue = this.resposeData4['cod_tipo_ejercicio']
					});
				},(err) => {
					this.showToast(err);
				});
			},(err) => {
				this.showToast(err);
			});
		}
	}

	exerciseSelected(){
		this.array = this.exercises.filter(select => select.id == this.getSelectedValue);
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
