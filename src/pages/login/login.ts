import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	private todo: FormGroup;
	public passwordType: string = 'password';
	public passwordShow: boolean = false;
	resposeData: any;
	timerVar;
	loginLoading;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider,
					public toastCtrl: ToastController,
					private formBuilder: FormBuilder,
					private loadingController: LoadingController) {

		this.todo = this.formBuilder.group({
			user: ['', [Validators.required, Validators.minLength(4)]],
			password: ['', [Validators.required, Validators.minLength(4)]]
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	logForm(){
		if (this.todo.valid) {
			this.authenticationLoading();
			var data = { 'usuario': this.todo.value.user, 'contrasena': this.todo.value.password};
			this.api.postLogin(data).then((result) => {
				this.resposeData = result;
				console.log('resposeData',this.resposeData);
				if (parseInt(this.resposeData) > 0) {
					this.loginLoading.dismiss();
					console.log(JSON.stringify(data));
					this.api.login(data);
					this.navCtrl.push(BluetoothPage).then(() => {
						const index = this.navCtrl.getActive().index;
						this.navCtrl.remove(0,index);
					});
				}else{
					this.showToast('Ingrese credenciales válidas');
					this.loginLoading.dismiss();
				}
			}, (err) =>{
				//Connection failed message
			});
		}
	}

	goToSignup(){
		this.navCtrl.push(SignupPage);
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

	showToast(message){
		console.log(message);
		let toast = this.toastCtrl.create({
			message: message,
			position: 'middle',
			duration: 3000
		});
		toast.present();
	}

	authenticationLoading(){
		this.loginLoading = this.loadingController.create({
			spinner: 'hide',
			content: `<div>
							<img src="../../assets/imgs/icon_giot.png" />
							<p>Autenticando...</p>
						</div>`,
			cssClass: 'loading',
		});
		this.loginLoading.present();
	}

}
