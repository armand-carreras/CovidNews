import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FireAuthService } from '../services/fire-auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {
  questionArray = [
    {
      sympthoms: 'Tienes fiebre?',
      result: 'Fiebre',
      dangerous: 'medio',
      img: 'https://image.freepik.com/free-vector/person-with-cold_23-2148482516.jpg',
      description: 'La fiebre combinada con otros sintomas puede ser grave.',

    },
    {
      sympthoms: 'Tienes tos seca?',
      result: 'Tos seca',
      dangerous: 'medio',
      img: 'https://image.freepik.com/free-vector/coughing-person-with-coronavirus_23-2148485525.jpg',
      description: 'La tos seca combinada con otros sintomas puede ser grave.',
    },
    {
      sympthoms: 'Te sientes cansado o dolorido?',
      result: 'Cansado o Dolorido',
      dangerous: 'medio',
      img: 'https://image.freepik.com/free-vector/tired-employee-exhausted-with-work_74855-4820.jpg',
      description: 'El cansancio sin actividad fisica puede indicar problemas en el organismo'
    },
    {
      sympthoms: 'Te duele el cuello o la cabeza?',
      result: 'Dolor de cuello o cabeza',
      dangerous: 'poco',
      img: 'https://image.freepik.com/free-vector/woman-with-sore-throat-sick-coronavirus-2019-ncov_24877-62826.jpg',
      description: 'Puede estar provocado por la tos seca otro de los factores del Covid',
    },
    {
      sympthoms: 'Tienes los ojos irritados?',
      result: 'Ojos irritados',
      dangerous: 'poco',
      img: 'https://image.freepik.com/free-photo/tired-teenager-with-crisp-hair_176532-8176.jpg',
      description: 'La fiebre combinada con otros sintomas puede ser grave.',
    },
    {
      sympthoms: 'Perdida del Gusto o Tacto?',
      result: 'Perdida de gusto o tacto',
      dangerous: 'danger',
      img: 'https://image.freepik.com/free-vector/people-with-food-collection-illustration_23-2148467330.jpg',
      description: 'La perdida del gusto o tacto es uno de los factores procupantes'
    },
    {
      sympthoms: 'Erupciones cutáneas?',
      result: 'Erupciones cutáneas',
      dangerous: 'poco',
      img: 'https://image.freepik.com/free-vector/person-suffering-from-rush_74855-6623.jpg',
      description: 'Por si solo este sintoma no tiene sentido'
    },
    {
      sympthoms: 'Dificultad para respirar?',
      result: 'Dificultad respiratoria',
      dangerous: 'danger',
      img: 'https://image.freepik.com/free-vector/lungs-with-coronavirus-2019-ncov-illustration_24877-62411.jpg',
      description: 'Si tienes problemas para respirar llama a tu medico.'
    },
    {
      sympthoms: 'Dolor o presion de pecho?',
      result: 'Presion en el pecho',
      dangerous: 'danger',
      img: 'https://image.freepik.com/free-vector/old-man-having-chest-pain_1308-48780.jpg',
      description: 'Con problemas de presion en el pecho deberias llamar a tu medico'
    },
    {
      sympthoms: 'Perdida de funciones motrices?',
      result: 'perdida de funciones motrices',
      dangerous: 'danger',
      img: 'https://image.freepik.com/free-vector/isometric-people-with-leg-injuries-bone-breaks-cracks-fracture-foot-orthopedic-problems-characters-crutches-walker-wheelchair-with-stick-rehabilitation-musculoskeletal-disorders_88138-404.jpg',
      description: 'Si tu movilidad se ha visto reducida sin aparente sentido, contacta con tu medico'
    }
  ];

  index: number;
  sintoma:string;
  resultado: string;
  peligroso: string;
  imagen:string;
  desc: string;
  trueList: any[];
  respuestas: [{
    hasSymptom?: boolean,
    result?: string,
    danger?: string,
  }?];


  constructor(private authService:FireAuthService,
              private storage: StorageService,
              private router: Router,
    ) { 
    this.index = 0;
    this.sintoma = this.questionArray[0].sympthoms;
    this.resultado = this.questionArray[0].result;
    this.peligroso = this.questionArray[0].dangerous;
    this.imagen = this.questionArray[0].img;
    this.desc = this.questionArray[0].description;
    this.respuestas = [];
    console.log(this.questionArray)
  }

  async ngOnInit() {

    const logged = await this.authService.isLogged$().toPromise();
    console.log(logged.uid);
  }



  async handleQuestions():Promise<any[]>{
    let lessCount = 0;
    let mediumCount = 0;
    let hardCount = 0;
    let List = [];

    for(let i = 0; i<this.respuestas.length; i++){
      let resp = this.respuestas[i];
      if(resp.hasSymptom){
        List.push(resp);
      }
      if( resp.danger == 'poco'){
        lessCount++;
      }
      else if(resp.danger == 'medio'){
        mediumCount++;
      }
      else if(resp.danger == 'danger'){
        hardCount++;
      }
    }
    if(lessCount == 3 || mediumCount == 2 || hardCount == 1){
      try{
        await this.storage.saveQuestionsSick(List);
      }
      catch(error){
        console.error(error)
      }
      return List;
    }
    
    else{
      try{
        await this.storage.saveQuestionshealthy(List);
      }
      catch(error){
        console.error(error)
      }
    }
    return List;
  }


  async yesQuestion(){
    if(this.index<this.questionArray.length-1){
      this.respuestas.push(
        {
          'hasSymptom':true,
          'result':this.questionArray[this.index].result,
          'danger': this.questionArray[this.index].dangerous
        }
      )
      this.index++;
      this.sintoma = this.questionArray[this.index].sympthoms;
      this.resultado = this.questionArray[this.index].result;
      this.peligroso = this.questionArray[this.index].dangerous;
      this.imagen = this.questionArray[this.index].img;
      this.desc = this.questionArray[this.index].description;
    }
    else{
      this.respuestas.push(
        {
          'hasSymptom':true,
          'result':this.questionArray[this.index].result,
          'danger': this.questionArray[this.index].dangerous
        }
      );
      try{ 
        await this.handleQuestions();
      }
      catch(error){
        console.error(error);
      }
      this.router.navigate(['daily']);
    }
  }
  async noQuestion(){
    if(this.index<this.questionArray.length-1){
      this.respuestas.push(
        {
          'hasSymptom':false,
          'result':this.questionArray[this.index].result,
          'danger': this.questionArray[this.index].dangerous
        }
      )
      this.index++;
      this.sintoma = this.questionArray[this.index].sympthoms;
      this.resultado = this.questionArray[this.index].result;
      this.peligroso = this.questionArray[this.index].dangerous;
      this.imagen = this.questionArray[this.index].img;
      this.desc = this.questionArray[this.index].description;
    }
    else{
      this.respuestas.push(
        {
          'hasSymptom':false,
          'result':this.questionArray[this.index].result,
          'danger': this.questionArray[this.index].dangerous
        }
      );
      try{ 
        await this.handleQuestions()
      }
      catch(error){
        console.error(error);
      }
      this.router.navigate(['daily']);
    }
  }
}
