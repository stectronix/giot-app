import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-rest',
  templateUrl: 'rest.html',
})
export class RestPage {

  timerVar;
  rest;
  countDown;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public platform: Platform) {
    this.rest = navParams.get('rest');

    this.platform.registerBackButtonAction(() => {
      let nav = app.getActiveNavs()[0];
      if (nav.canGoBack()){ //Can we go back?
          // no hacer nada
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestPage');
    this.timerVar = Observable.interval(1000).subscribe(x => {
			console.log('Exercise3: ' + x);
			if (x == parseInt(this.rest)) {
				this.timerVar.unsubscribe();
				this.navCtrl.pop();
			} else {
				this.countDown = this.rest - x;
			}
		});
  }

}
