import { DatePipe } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { ChartComponent } from '../chart/chart.component';
import { CountryData } from '../interface/country-data';
import { CovidService } from '../services/covid.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  countryList:any;
  full_countryList: any;
  jsonData:any;
  country:any;
  dateStr:string;
  selectedInfo:any;
  selectedCountry:string;
  constructor(private datePipe:DatePipe,
              private covidService:CovidService,
              private storage:StorageService,
              private modalController:ModalController) { 
                this.dateStr = '';
              }



  async ngOnInit() {
    try{
      this.jsonData = await this.storage.getWorldJson();
      this.countryList = await this.covidService.getCountriesList$().toPromise();
      this.countryList = this.countryList.countries;
      
    }
    catch(error){
      console.log(error);
    }
    this.full_countryList = this.countryList;
    console.log('jsonData',this.jsonData, this.countryList);
    
      this.dateStr = this.claculateDate();
   
    console.log(this.dateStr);
    
  }



  onSearch(event){
    console.log(event);
    const val = event.target.value;
    if (val && val.trim() != '') {
        this.countryList = this.full_countryList.filter((country) => {
            return (country.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
    else{
      this.countryList = this.full_countryList;
    }
  }



  async selectCountryData(country){
    let JSONData = this.jsonData;
    let countryData: CountryData = {
        name:'',
        global:{},
        country:{},
    };
    let date = new Date();
    let formatedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if(parseInt(this.datePipe.transform(date,"HH"))<6){
      let formated = this.datePipe.transform(date, 'yyyy-MM-dd');
      let arr = formated.split('-');
      let diaResta = parseInt(arr[2])-1;
      if(diaResta/10<=1){
          let dayStr = diaResta.toString();
          dayStr = '0'+dayStr;
          arr[2] = dayStr;
      }
      else{
          arr[2]=diaResta.toString();
      }
      formatedDate = arr.join('-');
      this.dateStr = formatedDate;
  }
    if(this.covidService.country_code == 'es'){
      console.log(formatedDate)
        countryData.name = JSONData.dates[formatedDate].countries[country].name_es;
    }
    else if(this.covidService.country_code == 'it'){
        countryData.name = JSONData.dates[formatedDate].countries[country].name_it;
    }
    else{
        countryData.name = JSONData.dates[formatedDate].countries[country].name;
    }
    countryData.global.TodayConfirmed = parseInt(JSONData.total.today_confirmed);
    countryData.global.TodayDeaths = parseInt(JSONData.total.today_deaths);
    countryData.global.TodayRecovered = parseInt(JSONData.total.today_recovered);
    countryData.global.YesterdayConfirmed = parseInt(JSONData.total.yesterday_confirmed);
    countryData.global.YesterdayDeaths = parseInt(JSONData.total.yesterday_deaths);
    countryData.global.YesterdayRecovered = parseInt(JSONData.total.yesterday_recovered);
    countryData.global.Last_update = JSONData.updated_at;

    countryData.country.TodayConfirmed = parseInt(JSONData.dates[formatedDate].countries[country].today_confirmed);
    countryData.country.TodayHospitalizedPatients = parseInt(JSONData.dates[formatedDate].countries[country].today_total_hospitalised_patients);
    countryData.country.TodayDeaths =parseInt(JSONData.dates[formatedDate].countries[country].today_deaths);
    countryData.country.TodayIntensiveCare =parseInt(JSONData.dates[formatedDate].countries[country].today_intensive_care);
    countryData.country.TodayRecovered =parseInt(JSONData.dates[formatedDate].countries[country].today_recovered);
    countryData.country.YesterdayConfirmed =parseInt(JSONData.dates[formatedDate].countries[country].yesterday_confirmed);
    countryData.country.YesterdayHospitalizedPatients = parseInt(JSONData.dates[formatedDate].countries[country].yesterday_total_hospitalised_patients);
    countryData.country.YesterdayDeaths =parseInt(JSONData.dates[formatedDate].countries[country].yesterday_deaths);
    countryData.country.YesterdayIntensiveCare =parseInt(JSONData.dates[formatedDate].countries[country].yesterday_intensive_care);
    countryData.country.YesterdayRecovered =parseInt(JSONData.dates[formatedDate].countries[country].yesterday_recovered);
    countryData.country.regions = JSONData.dates[formatedDate].countries[country].regions;

    countryData.country.todayVsYesterdayConfirmed = countryData.country.TodayConfirmed - countryData.country.YesterdayConfirmed;
    countryData.country.todayVsYesterdayDeaths = countryData.country.TodayDeaths - countryData.country.YesterdayDeaths;
    countryData.country.todayVsYesterdayIntensiveCare = countryData.country.TodayIntensiveCare - countryData.country.YesterdayIntensiveCare;
    countryData.country.todayVsYesterdayHospitalizedPatients = countryData.country.TodayHospitalizedPatients - countryData.country.YesterdayHospitalizedPatients;
    countryData.country.todayVsYesterdayRecovered = countryData.country.TodayRecovered - countryData.country.YesterdayRecovered;

    countryData.global.todayVsYesterdayConfirmed = countryData.global.TodayConfirmed - countryData.global.YesterdayConfirmed;
    countryData.global.todayVsYesterdayDeaths = countryData.global.TodayDeaths - countryData.global.YesterdayDeaths;
    countryData.global.todayVsYesterdayRecovered = countryData.global.TodayRecovered - countryData.global.YesterdayRecovered;

    this.selectedInfo = countryData;
    console.log(this.selectedInfo);
    await this.presentModal();
}

claculateDate(){
    let date = new Date();
    let formatedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    console.log('calculateDate: ', formatedDate);
    if(parseInt(this.datePipe.transform(date,"HH"))<6){
      console.log('calculateDate IF: ', formatedDate);
      let formated = this.datePipe.transform(date, 'yyyy-MM-dd');
      let arr = formated.split('-');
      let diaResta = parseInt(arr[2])-1;
      if(diaResta/10<=1){
          let dayStr = diaResta.toString();
          dayStr = '0'+dayStr;
          arr[2] = dayStr;
      }
      else{
          arr[2]=diaResta.toString();
      }
      formatedDate = arr.join('-');
    }
    return formatedDate;
  
}


async presentModal(){


  const modal = await this.modalController.create({
    component: ChartComponent,
    componentProps: {
      countryData: this.selectedInfo
    }
  });

  return await modal.present();

}
}
