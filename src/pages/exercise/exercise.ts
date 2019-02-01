import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {

	array: any[];
	array2: any[];
	private todo: FormGroup;
	getSelectedValue: any;
	getSelectedValue2: any;
	resposeData;
	resposeData2;
	resposeData3;
	resposeData4;
	id;
	machines;
	exercises;
	today;
	cod_categoria;
	repeticion;
	peso;
	descanso;
	series;

	constructor(public navCtrl: NavController,
					public navParams: NavParams,
					public api: ApiProvider,
					private formBuilder: FormBuilder,
					private toastCtrl: ToastController) {

		$.ajax({
			type:'GET',
			contentType: 'application/json',
			dataType: "json",
				crossDomain: true,
			headers: {
				'Content-Type': 'application/json'
			},
			url: "http://giot.cl/panelgym/public/maquina",
			success: function(dados)
			{
				var i,j
				for (i=0;i<dados.length;i++){
					for (j=0;j<dados[i].length;j++){
						$('#machine').append($('<option>', {
							value: dados[i][j].id,
							text : dados[i][j].descripcion
						}));
					}
				}
			}
		});

		$.ajax({
			type:'GET',
			contentType: 'application/json',
			dataType: "json",
				crossDomain: true,
			headers: {
				'Content-Type': 'application/json'
			},
			url: "http://giot.cl/panelgym/public/tipoejercicio",
			success: function(dados)
			{
				var i,j
				for (i=0;i<dados.length;i++){
					for (j=0;j<dados[i].length;j++){
						$('#exercise').append($('<option>', {
							value: dados[i][j].id,
							text : dados[i][j].descripcion
						}));
					}
				}
			}
		});

		// $("#machine").change(function () {
		// 	$("#machine").val();
	  	// });

		// $('#exercise').empty();
		// $.ajax({
		// 	type:'POST',
		// 	contentType: 'application/json',
		// 	dataType: "json",
		// 		crossDomain: true,
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	url: "http://giot.cl/panelgym/public/ejerciciomaquina",
		// 	data : JSON.stringify({
		// 		// cod_maquina: maquina
		// 	}),
		// 	success: function(dados)
		// 	{
		// 		var i,j;
		// 		for (i=0;i<dados.length;i++){
		// 			for (j=0;j<dados[i].length;j++){
		// 				$('#exercise').append($('<option>', {
		// 					value: dados[i][j].id,
		// 					text : dados[i][j].descripcion
		// 				}));
		// 			}
		// 		}
		// 	}
		// });

		// $('#exercise').append($('<option>', {
		// 	value: 0,
		// 	text : '-- SELECCIONE --'
		// }));

		this.todo = this.formBuilder.group({
			// machine: ['', Validators.required],
			// exercise: ['', Validators.required],
			series: ['', Validators.required],
			repetitions: ['', Validators.required],
			weight: ['', Validators.required],
			rest: ['', Validators.required]
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ExercisePage');
	}

	ionViewWillEnter(){
		this.cod_categoria = 1;
		this.api.getUser().then((user) => {
			var data = {'usuario':user['usuario']};
			this.api.getDataClient(data).then((result) => {
				this.resposeData = result[0];
				this.id = this.resposeData['id'];
			});
		});
		// this.api.getAllMachines().then((machine) => {
		// 	this.resposeData2 = machine[0];
		// },(err) => {
		// 	this.showToast(err);
		// });
		// this.api.getExercise().then((exercise) => {
		// 	this.resposeData3 = exercise[0];
		// },(err) => {
		// 	this.showToast(err);
		// });

		var date = new Date()
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
		this.today = date.getFullYear().toString() + '-' + monthAux + '-' + dayAux;
		console.log('Fecha: ',this.today);
	}

	goBack(){
		this.navCtrl.pop();
	}

	saveRoutine(){
			// var data = JSON.stringify({
			// 				'cod_categoria': 1,
			// 				'descripcion': parseInt(this.todo.value.series),
			// 				'repeticion': parseInt(this.todo.value.repetitions),
			// 				'descanso': parseInt(this.todo.value.rest),
			// 				'indicacion': parseInt(this.todo.value.weight),
			// 				'cod_cliente': parseInt(this.id),
			// 				'cod_maquina': parseInt(this.getSelectedValue),
			// 				'cod_tipo_ejercicio': parseInt(this.getSelectedValue2),
			// 				'fecha': this.today
			// 			});
			// console.log('ExercisePage: ' + JSON.stringify(data));
			// this.api.postSaveExercise(data).then((exercise) => {
			// 	this.resposeData4 = exercise
			// 	this.navCtrl.pop();
			// },(err) => {
			// 	this.showToast(err);
			// });

			$.ajax({
				type:'POST',
				contentType: 'application/json',
				dataType: "json",
				crossDomain: true,
				headers: {
					'Content-Type': 'application/json'
				},
				url: "http://giot.cl/panelgym/public/ingresarejercicio",
				data : JSON.stringify({
					cod_categoria:$("#cod_categoria2").val(),
					descripcion:$("#series2").val(),
					repeticion:$("#repetitions2").val(),
					descanso:$("#rest2").val(),
					indicacion:$("#weight2").val(),
					cod_cliente: $("#id2").val(),
					cod_maquina:$("#machine2").val(),
					cod_tipo_ejercicio:$("#exercise2").val(),
					fecha:$("#today2").val()
				})
			}).done(function(res){
				alert("Registro ingresado exitosamente" + JSON.stringify(res));
			}).fail(function(err){
				alert("Registro no ingresado" + JSON.stringify(err));
			});
	}

	machineSelected(){
		this.array = this.machines.filter(select => select.id == this.getSelectedValue);
		console.log('id es ' + this.getSelectedValue);
		console.log('valor es ' + this.array[0].descripcion);
	}

	exerciseSelected(){
		this.array2 = this.exercises.filter(select => select.id == this.getSelectedValue2);
		console.log('id es ' + this.getSelectedValue2);
		console.log('valor es ' + this.array2[0].descripcion);
	}

	showToast(message){
		let toast = this.toastCtrl.create({
			position: 'middle',
			message: message,
			duration: 2000
		});
		toast.present();
	}

	saveCamp(){
		if (this.todo.valid) {
			this.series = this.todo.value.series;
			this.repeticion = this.todo.value.repetitions;
			this.descanso = this.todo.value.rest;
			this.peso = this.todo.value.weight;
			this.saveRoutine();
		}
	}

}
