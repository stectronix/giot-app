import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
	selector: 'page-finish',
	templateUrl: 'finish.html',
})
export class FinishPage {

	mili;
	sec;
	min;
	timerVar;
	repetitions;

	constructor(public navCtrl: NavController, public navParams: NavParams) {

		this.repetitions = navParams.get('repetitions')
		this.mili = navParams.get('mili');
		this.sec = navParams.get('sec');
		this.min = navParams.get('min');

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FinishPage');
		this.timerVar = Observable.interval(1000).subscribe(x => {
			if (x > 10) {
				this.navCtrl.push(HomePage).then(() => {
					const index = this.navCtrl.getActive().index;
					this.navCtrl.remove(0,index);
				});
				this.timerVar.unsubscribe();
			}
		});
	}

}
