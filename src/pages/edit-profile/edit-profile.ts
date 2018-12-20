import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@IonicPage()
@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

	private todo: FormGroup;
	selectedDate;
	photo: SafeResourceUrl;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					private formBuilder: FormBuilder,
					private datePicker: DatePicker,
					private alertCtrl: AlertController,
					private camera: Camera,
					private sanitizer: DomSanitizer) {

		this.todo = this.formBuilder.group({
			name: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			weight: ['', [Validators.required]],
			height: ['', [Validators.required]],
			birthday: ['',[Validators.required]],
			gender: ['',[Validators.required]]
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EditProfilePage');
		this.photo = '../../assets/imgs/profile_default.png';
		console.log('urlDefault' + this.photo);
	}

	updateForm(){
		if (this.todo.valid) {

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
				this.selectedDate = date.getDate().toString() + '/' + month + '/' + date.getFullYear();
				console.log('Fecha2: ' + date.getDate().toString() + month + date.getFullYear());
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

}
