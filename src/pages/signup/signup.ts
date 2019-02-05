import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { MatchPasswordProvider } from '../../providers/api/match-password';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {

	private todo: FormGroup;
	passwordType: string = 'password';
	passwordShow: boolean = false;
	notMatch: string;
	resposeData: any;
	registerLoading;
	date;
	month;
	day;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider,
					public toastCtrl: ToastController,
					private formBuilder: FormBuilder,
					private loadingController: LoadingController) {

		this.todo = this.formBuilder.group({
			name: ['',[Validators.required,Validators.minLength(3)]],
			// lastName: ['',[Validators.required, Validators.minLength(3)]],
			email: ['',[Validators.required, Validators.email]],
			user: ['',[Validators.required, Validators.minLength(4)]],
			password: ['',[Validators.required, Validators.minLength(4)]],
			confirmPassword: ['',[Validators.required, Validators.minLength(4)]],
		},{
			validator: MatchPasswordProvider.MatchPassword
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
		var f = new Date();
		if (f.getDay() < 10) {
			this.day = '0' + f.getDate();
		} else {
			this.day = f.getDate();
		}
		this.date = f.getFullYear() + '-' + f.getMonth() + 1 + '-' + this.day;
		console.log('fecha: ', this.date);
	}

	registerForm(){
		if (this.todo.valid) {
			this.authenticationLoading();
			var data = {'rut': '',
							'nombre': this.todo.value.name,
							'fecha_nacimiento': '',
							'peso': '',
							'genero': '',
							'altura': '',
							'telefono': '',
							'email': this.todo.value.email,
							'direccion': '',
							'cod_estado': 1,
							'cod_tipo_cliente': 2,
							'usuario': this.todo.value.user,
							'contrasena': this.todo.value.password,
							/* 'fecha': this.date */};
			var check = {'usuario': this.todo.value.user}
			this.api.checkExistUser(check).then((result) => {
				this.resposeData = result;
				if (parseInt(this.resposeData) < 1) {
					this.api.postSignup(data).then((result) => {
						this.resposeData = result;
						console.log('respuesta', this.resposeData)
						if (this.resposeData != null) {
							this.registerLoading.dismiss();
							console.log(JSON.stringify(data));
							this.api.login(data);
							this.navCtrl.push(BluetoothPage).then(() => {
								const index = this.navCtrl.getActive().index;
								this.navCtrl.remove(0,index);
							});
						}else{
							this.showToast('Ingrese datos válidos');
							this.registerLoading.dismiss();
						}
					}, (err) =>{
						//Connection failed message
					});
				} else {
					this.showToast('Usuario ya existe');
					this.registerLoading.dismiss();
				}
			});

		}
	}

	public togglePassword(){
		if (this.passwordShow) {
			this.passwordShow = false;
			this.passwordType = 'password';
		} else {
			this.passwordShow = true;
			this.passwordType = 'password';
		}
	}

	authenticationLoading(){
		this.registerLoading = this.loadingController.create({
			spinner: 'hide',
			content: `<div>
							<img src="../../assets/imgs/icon_giot.png" />
							<p>Autenticando...</p>
						</div>`,
			cssClass: 'loading',
		});
		this.registerLoading.present();
	}

	showToast(message){
		console.log(message);
		let toast = this.toastCtrl.create({
			message: message,
			position: 'middle',
			duration: 3000
		});
		toast.present();
	}

}
