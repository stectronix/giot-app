import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiProvider } from '../../providers/api/api';
import * as $ from "jquery";

@IonicPage()
@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

	private todo: FormGroup;
	selectedDate;
	photo: SafeResourceUrl;
	resposeData: any;
	id;
	rut;
	nombre;
	altura;
	peso;
	telefono;
	email;
	direccion;
	cod_estado;
	cod_tipo_cliente;
	usuario;
	contrasena;
	fecha;
	updateLoading;
	gender;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider,
					private formBuilder: FormBuilder,
					private datePicker: DatePicker,
					private alertCtrl: AlertController,
					private camera: Camera,
					private sanitizer: DomSanitizer,
					private loadingController: LoadingController) {

		this.todo = this.formBuilder.group({
			name: ['', [Validators.required]],
			// lastName: ['', [Validators.required]],
			weight: ['', [Validators.required]],
			height: ['', [Validators.required]],
			birthday: ['',[Validators.required]],
			gender: ['',[Validators.required]]
		});

	}

	ionViewWillEnter(){
		this.api.getUser().then((user) => {
			// console.log('user: ' + JSON.stringify(user));
			var data = {'usuario':user['usuario']};
			this.api.getDataClient(data).then((result) => {
				this.resposeData = result[0];
				this.id = this.resposeData['id'];
				this.nombre = this.resposeData['nombre'];
				this.altura = this.resposeData['altura'];
				this.peso = this.resposeData['peso'];
				this.selectedDate = this.resposeData['fecha_nacimiento'];
				this.rut = this.resposeData['rut'];
				this.telefono = this.resposeData['telefono'];
				this.email = this.resposeData['email'];
				this.direccion = this.resposeData['direccion'];
				this.cod_estado = this.resposeData['cod_estado'];
				this.cod_tipo_cliente = this.resposeData['cod_tipo_cliente'];
				this.usuario = this.resposeData['usuario'];
				this.contrasena = this.resposeData['contrasena'];
				this.fecha = this.resposeData['fecha'];
			});
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EditProfilePage');
		this.photo = '../../assets/imgs/profile_default.png';
		console.log('urlDefault' + this.photo);
	}

	updateForm(){
		if (this.todo.valid) {
			this.updatingLoading();
			var data = {'id': this.id,
							'rut': this.rut,
							'nombre': this.todo.value.name,
							'fecha_nacimiento': this.todo.value.birthday ,
							'peso': parseInt(this.todo.value.weight),
							'genero': this.todo.value.gender,
							'altura': parseInt(this.todo.value.height),
							'telefono': this.telefono,
							'email': this.email,
							'direccion': this.direccion,
							'cod_estado': parseInt(this.cod_estado),
							'cod_tipo_cliente': parseInt(this.cod_tipo_cliente),
							'usuario': this.usuario,
							'contrasena': this.contrasena,
							'fecha': this.fecha,
			};
			console.log('EditProfile1: ',JSON.stringify(data));
			this.api.updateProfile(data).then((result) => {
				this.resposeData = result;
				if (this.resposeData != null) {
					this.updateLoading.dismiss();
					this.showToast('Datos actualzados correctamente');
					this.navCtrl.pop();
				}

			}, (err) => {
				//Connection failed message
			});
		}
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

	selectPhoto(){
		let alertCtrl = this.alertCtrl.create({
			title: 'Cambiar Foto',
			buttons: [
				{
					text: 'Cargar Foto',
					handler: data => {
						console.log('cargar foto seleccionado');
						const options: CameraOptions = {
							quality: 100,
							destinationType: this.camera.DestinationType.FILE_URI,
							sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
							saveToPhotoAlbum: false
						 }
						 this.camera.getPicture(options).then((imageData) => {
						  // imageData is either a base64 encoded string or a file URI
						  // If it's base64 (DATA_URL):
							this.photo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + imageData);
							console.log('url: ' + this.photo);
						 }, (err) => {
						  // Handle error
						  console.log('camera error: ' + err);
						 });
					}
				},
				{
					text: 'Tomar Foto',
					handler: data => {
						console.log('tomar foto seleccionado');
						const options: CameraOptions = {
							quality: 100,
							destinationType: this.camera.DestinationType.FILE_URI,
							encodingType: this.camera.EncodingType.JPEG,
							mediaType: this.camera.MediaType.PICTURE
						 }
						 this.camera.getPicture(options).then((imageData) => {
						  // imageData is either a base64 encoded string or a file URI
						  // If it's base64 (DATA_URL):
							this.photo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + imageData);
							console.log('url: ' + this.photo);
						 }, (err) => {
						  // Handle error
						  console.log('camera error: ' + err);
						 });
					}
				},
				{
					text: 'Cancel',
					role: 'cancel',
					handler: data => {
						console.log('Cancelado por el usuario');
					}
				}
			]
		});
		alertCtrl.present();
	}

	goBack(){
		this.navCtrl.pop()
	}

	updatingLoading(){
		this.updateLoading = this.loadingController.create({
			spinner: 'hide',
			content: `<div>
							<img src="../../assets/imgs/icon_giot.png" />
							<p>Actualizando...</p>
						</div>`,
			cssClass: 'loading',
		});
		this.updateLoading.present();
	}

	showToast(message){

	}

}
