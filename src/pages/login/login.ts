import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	private todo: FormGroup;
	public passwordType: string = 'password';
	public passwordShow: boolean = false;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					private formBuilder: FormBuilder,
					private authService: AuthServiceProvider) {

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
			this.authService.setLoggedIn(true);
			this.navCtrl.push(BluetoothPage).then(() => {
				const index = this.navCtrl.getActive().index;
				this.navCtrl.remove(0,index);
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

}
