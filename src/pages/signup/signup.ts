import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BluetoothPage } from '../bluetooth/bluetooth';

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

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					private formBuilder: FormBuilder,
					private ngZone: NgZone) {

		this.todo = this.formBuilder.group({
			name: ['',[Validators.required,Validators.minLength(3)]],
			lastName: ['',[Validators.required, Validators.minLength(3)]],
			email: ['',[Validators.required, Validators.email]],
			password: ['',[Validators.required, Validators.minLength(4)]],
			confirmPassword: ['',[Validators.required, Validators.minLength(4)]],
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
	}

	registerForm(){
		if (this.todo.value.password == this.todo.value.confirmPassword) {
			this.navCtrl.push(BluetoothPage);
		} else {
			this.ngZone.run(() => {
				this.notMatch = 'Contraseñas no coinciden';
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

}
