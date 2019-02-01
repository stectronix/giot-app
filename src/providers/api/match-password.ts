import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class MatchPasswordProvider {

	constructor(public http: HttpClient) {
		console.log('Hello MatchPasswordProvider Provider');
	}

	 // Validation for password and confirm password
    static MatchPassword(AC: AbstractControl) {
		const password = AC.get('password').value // to get value in input tag
		const confirmPassword = AC.get('confirmPassword').value // to get value in input tag
		 if(password != confirmPassword) {
			  console.log('false');
			  AC.get('confirmPassword').setErrors( { MatchPassword: true } )
		 } else {
			  console.log('true')
			  AC.get('confirmPassword').setErrors(null);
		 }
	}

}
