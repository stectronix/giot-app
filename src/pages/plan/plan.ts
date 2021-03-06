import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { RoutinePage } from '../routine/routine';
import { ExercisePage } from '../exercise/exercise';
import { DatePicker } from '@ionic-native/date-picker';

@IonicPage()
@Component({
	selector: 'page-plan',
	templateUrl: 'plan.html',
})
export class PlanPage {

	exercises;
	resposeData: any;
	resposeData2: any;
	resposeData3: any;
	id;
	exercise;
	device;
	sw;
	peripheral;
	selectedDate

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider,
					public toastCtrl: ToastController,
					private datePicker: DatePicker,
					private alertCtrl: AlertController) {

		this.device = navParams.get('device');

		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		}

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PlanPage');
		this.exercises = [];
	}

	ionViewWillEnter(){
		this.api.getUser().then((user) => {
			var data = {'usuario':user['usuario']};
			this.api.getDataClient(data).then((result) => {
				this.resposeData = result[0];
				this.id = this.resposeData['id'];
				var data3 = {'id':this.id}
				this.api.getExercise(data3).then((exercise2) => {
					this.resposeData3 = exercise2[0];
					this.exercises = this.resposeData3;
				},(err) => {
					this.showToast(err);
				});
			});
		});
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
				var data2 = {'id': this.id, 'fecha': this.selectedDate};
				this.api.getExerciseClient(data2).then((exercise) => {
					this.resposeData2 = exercise[0];
					this.exercises = this.resposeData2;
				},(err) => {
					this.showToast(err);
				});
			},
			err => console.log('Error al obtener fecha',err)
		);
	}

	exerciseSelected(exercise){
		this.navCtrl.push(RoutinePage,{
			routine: exercise,
			device: this.device
		});
	}

	goBack(){
		this.navCtrl.pop();
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

	goToPlan(){
		this.navCtrl.push(ExercisePage);
	}

}
