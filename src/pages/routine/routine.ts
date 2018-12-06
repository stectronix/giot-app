import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkoutPage } from '../workout/workout';
import { BLE } from '@ionic-native/ble';

const REPETITIONS_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const REPETITIONS_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

@IonicPage()
@Component({
	selector: 'page-routine',
	templateUrl: 'routine.html',
})
export class RoutinePage {

	select: any[];
	code;
	name;
	barcode;
	private todo: FormGroup;
	exercises: any[] = [];
	getSelectedValue: any;
	array: any;
	peripheral: any = {};
	device;
	sw;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public toastCtrl: ToastController,
					private formBuilder: FormBuilder,
					private ble: BLE,
					private alertCtrl: AlertController,
					private ngZone: NgZone) {

		this.exercises = [
			{
				'id': '01',
				'name': 'curl de bicep'
			},
			{
				'id': '02',
				'name': 'extensión de cuadricep'
			},
			{
				'id': '03',
				'name': 'jalones de polea'
			},
			{
				'id': '04',
				'name': 'curl de bicep femoral'
			},
			{
				'id': '05',
				'name': 'estocada estacionaria'
			},
		];

		this.select = navParams.get('select');
		this.barcode = navParams.get('barcode');
		this.device = navParams.get('device');

		if (this.device == null) {
			this.showToast('No está conectado');
			this.sw = 0;
		} else {
			console.log('Conectando a ' + this.device.name || this.device.id);
			this.ble.connect(this.device.id).subscribe(
				peripheral => this.onConnected(peripheral),
				peripheral => this.showAlert('Desconectado','El dispositivo de desconectó inesperadamente')
			);
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
		if (this.todo.valid) {
			this.navCtrl.push(WorkoutPage,{
				device: this.device,
				series: this.todo.value.series,
				repetitions: this.todo.value.repetitions,
				weight: this.todo.value.weight
			});
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RoutinePage');
		if (this.select == null) {
			console.log(this.barcode);
			this.ngZone.run(() => {
				this.name = this.barcode.text
				this.code = 0;
			});
		} else {
			console.log(this.select[0].code + ' ' + this.select[0].name);
			this.ngZone.run(() => {
				this.code = this.select[0].code,
				this.name = this.select[0].name
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
