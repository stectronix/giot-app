import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { DatePicker } from '@ionic-native/date-picker';

@IonicPage()
@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {

	array: any[];
	array2: any[];
	private todo: FormGroup;
	getSelectedValue: any;
	getSelectedValue2: any;
	resposeData;
	resposeData2;
	resposeData3;
	resposeData4;
	id;
	machines;
	exercises;
	selectedDate;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider,
					private datePicker: DatePicker,
					private alertCtrl: AlertController,
					private formBuilder: FormBuilder,
					private toastCtrl: ToastController) {

		this.todo = this.formBuilder.group({
			date: ['', Validators.required],
			machine: ['', Validators.required],
			exercise: ['', Validators.required],
			series: ['', Validators.required],
			repetitions: ['', Validators.required],
			weight: ['', Validators.required],
			rest: ['', Validators.required]
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ExercisePage');
		this.api.getAllMachines().then((machines) => {
			this.resposeData = machines[0];
			this.machines = this.resposeData;
		});
	}

	machineSelected(){
		this.array = this.machines.filter(select => select.id == this.getSelectedValue);
		console.log('id es ' + this.getSelectedValue);
		console.log('valor es ' + this.array[0].descripcion);
		var data = {'cod_maquina': this.array[0].id}
			this.api.getExerciseByMachine(data).then((exercise) => {
				this.resposeData2 = exercise[0];
				this.exercises = this.resposeData2
			},(err) => {
				this.showToast(err);
		});
	}

	exerciseSelected(){
		this.array2 = this.exercises.filter(select => select.id == this.getSelectedValue2);
		console.log('id es ' + this.getSelectedValue2);
		console.log('valor es ' + this.array2[0].descripcion);
	}

	showDatePicker(){
		this.datePicker.show({
			date: new Date(),
			mode: 'date',
			androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
		}).then(
			date => {
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
				this.selectedDate = date.getFullYear().toString() + '-' + monthAux + '-' + dayAux;
				console.log('Fecha: ',this.selectedDate);
			},
			err => console.log('Error al obtener fecha',err)
		);
	}

	goBack(){
		this.navCtrl.pop();
	}

	saveRoutine(){
		if (this.todo.valid) {
			this.api.getUser().then((user) => {
				var data2 = {'usuario': user['usuario']};
				this.api.getDataClient(data2).then((client) => {
					this.resposeData3 = client[0];
					this.id = this.resposeData3['id'];
					var data3 ={'cod_categoria':1,
									'descripcion':this.todo.value.series,
									'repeticion':this.todo.value.repetitions,
									'descanso':this.todo.value.rest,
									'indicacion':this.todo.value.weight,
									'cod_cliente':this.id,
									'cod_maquina':this.getSelectedValue,
									'cod_tipo_ejercicio':this.getSelectedValue2,
									'fecha':this.selectedDate,
									'planificado':0,
									'cod_profesional':0,
									'terminada':0
									}
					console.log('ExercisePage1: ' + JSON.stringify(data3));
					this.api.postSaveExercise(data3).then((exercise) => {
						this.resposeData4 = exercise[0];
						this.showToast('Rutina guardada con éxito')
					},(err) => {
						this.showToast(err)
					});
				})
			});
		}
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
