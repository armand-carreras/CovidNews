import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CovidService } from '../services/covid.service';
import { DatePipe } from '@angular/common';
import { CountryData } from '../interface/country-data';
import { RegionData } from '../interface/region-data';
import { stringify } from '@angular/compiler/src/util';
// import { GoogleChartInterface } from 'ng2-google-charts';



@Component({
  selector: 'app-daily',
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.scss'],
})
export class DailyPage implements OnInit {
    // public pieChart: GoogleChartInterface;
    // public countryPieChart: GoogleChartInterface;
    todayTimestamp: Date;
    routeResolveData: any;
    countryData: CountryData;
    regionData: RegionData;
    options:any;

  constructor(private route: ActivatedRoute,
            private covidService:CovidService,
            private datePipe: DatePipe,) {
                this.todayTimestamp = new Date();
                
                
            }


            ngOnInit() {
                // this.covidService.runCountry().then(resp=>console.log('runCountry UserPage',this.covidService.country)).catch(error=> console.log(error));
                
                
                if(this.route && this.route.data){  
                    console.log('route.data: ', this.route.data);
                const promiseObservable = this.route.data;    
                
                if(promiseObservable){
            
                    promiseObservable.subscribe(promiseValue =>{
                        console.log('promiseValue["items"]', JSON.stringify(promiseValue['items']))
                    const dataObservable = promiseValue['items'];
                    if(dataObservable){
                        console.log('dataObservable: ',dataObservable);
                        dataObservable.subscribe(observableValue =>{
                        const pageData: any = observableValue;
                        console.log('userPage observableValue : ',observableValue);
                        if(pageData){
                            this.routeResolveData = pageData;
                            this.countryData=this.fillData(this.routeResolveData);
                            // this.fillChart(this.countryData)
                        }
                        }, err=>{console.warn('http Error',err.message)});
                    }else {
                        console.warn('No dataObservable coming from Route Resolver promiseObservable');
                    }
                    });
                } else {
                    console.warn('No promiseObservable coming from Route Resolver data');
                }
                } else {
                console.warn('No data coming from Route Resolver');
                }
            }



        onClick(){};
        
        // fillChart(countryData: CountryData){
        //     this.pieChart={
        //         chartType: 'PieChart',
        //         dataTable: [
        //             // ['Dead', this.countryData.global.TodayDeaths/this.countryData.global.TodayConfirmed*100],
        //             ['Status', 'Cases'],
        //             ['Dead',     countryData.global.TodayDeaths],
        //             ['Infected',   countryData.global.TodayConfirmed - countryData.global.TodayDeaths - countryData.global.TodayRecovered],
        //             ['Recovered',  countryData.global.TodayRecovered]
        //         ],
        //         // firstRowIsData: true,
        //         options: {
        //             title: 'Current Cases',
        //             width:'100%',
        //             height:'350px',
        //             is3D: true,
        //             backgroundColor: '#121212',
        //             fontSize:'1.5rem',
        //             chartArea:{
        //                 width: '75%',
        //                 height: '75%',
        //                 left: 0,
        //                 // top: 0
        //             },
        //             legend:{
        //                 position: 'right',
        //                 alignment: 'center',
        //                 textStyle: {
        //                     color: 'white',
        //                     fontSize: 10
        //                 }
        //             }
        //         },
                
        //     };
        //     this.countryPieChart={
        //         chartType: 'PieChart',
        //         dataTable: [
        //             // ['Dead', this.countryData.global.TodayDeaths/this.countryData.global.TodayConfirmed*100],
        //             ['Status', 'Cases'],
        //             ['Dead',     countryData.country.TodayDeaths],
        //             ['Infected',   countryData.country.TodayConfirmed - countryData.country.TodayDeaths - countryData.country.TodayRecovered],
        //             ['Hospitalized', countryData.country.TodayHospitalizedPatients],
        //             ['Intensive Care', countryData.country.TodayIntensiveCare],
        //             ['Recovered',  countryData.country.TodayRecovered]
        //         ],
        //         // firstRowIsData: true,
        //         options: {
        //             'title': 'Current Cases',
        //             pieStartAngle: '200',
        //             width:'100%',
        //             height:'auto',
        //             is3D: true,
        //             backgroundColor: '#121212',
        //             fontSize:'1.5rem',
        //             chartArea:{
        //                 width: '75%',
        //                 height: '75%',
        //                 left: 0,
        //                 // top: 0
        //             },
        //             legend:{
        //                 position: 'right',
        //                 alignment: 'center',
        //                 textStyle: {
        //                     color: 'white',
        //                     fontSize: 10
        //                 }
        //             }
        //         },
                
        //     };
        // }

        fillData(JSONData): CountryData{
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
                arr[2] = stringify(parseInt(arr[2])-1);
                formatedDate = arr.join('-');
            }
            if(this.covidService.country_code == 'es'){
                countryData.name = JSONData.dates[formatedDate].countries[this.covidService.country].name_es;
            }
            else if(this.covidService.country_code == 'it'){
                countryData.name = JSONData.dates[formatedDate].countries[this.covidService.country].name_it;
            }
            else{
                countryData.name = JSONData.dates[formatedDate].countries[this.covidService.country].name;
            }
            countryData.global.TodayConfirmed = parseInt(JSONData.total.today_confirmed);
            countryData.global.TodayDeaths = parseInt(JSONData.total.today_deaths);
            countryData.global.TodayRecovered = parseInt(JSONData.total.today_recovered);
            countryData.global.YesterdayConfirmed = parseInt(JSONData.total.yesterday_confirmed);
            countryData.global.YesterdayDeaths = parseInt(JSONData.total.yesterday_deaths);
            countryData.global.YesterdayRecovered = parseInt(JSONData.total.yesterday_recovered);
            countryData.global.Last_update = JSONData.updated_at;
        
            countryData.country.TodayConfirmed = parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].today_confirmed);
            countryData.country.TodayHospitalizedPatients = parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].today_total_hospitalised_patients);
            countryData.country.TodayDeaths =parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].today_deaths);
            countryData.country.TodayIntensiveCare =parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].today_intensive_care);
            countryData.country.TodayRecovered =parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].today_recovered);
            countryData.country.YesterdayConfirmed =parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].yesterday_confirmed);
            countryData.country.YesterdayHospitalizedPatients = parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].yesterday_total_hospitalised_patients);
            countryData.country.YesterdayDeaths =parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].yesterday_deaths);
            countryData.country.YesterdayIntensiveCare =parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].yesterday_intensive_care);
            countryData.country.YesterdayRecovered =parseInt(JSONData.dates[formatedDate].countries[this.covidService.country].yesterday_recovered);
            countryData.country.regions = JSONData.dates[formatedDate].countries[this.covidService.country].regions;

            countryData.country.todayVsYesterdayConfirmed = countryData.country.TodayConfirmed - countryData.country.YesterdayConfirmed;
            countryData.country.todayVsYesterdayDeaths = countryData.country.TodayDeaths - countryData.country.YesterdayDeaths;
            countryData.country.todayVsYesterdayIntensiveCare = countryData.country.TodayIntensiveCare - countryData.country.YesterdayIntensiveCare;
            countryData.country.todayVsYesterdayHospitalizedPatients = countryData.country.TodayHospitalizedPatients - countryData.country.YesterdayHospitalizedPatients;
            countryData.country.todayVsYesterdayRecovered = countryData.country.TodayRecovered - countryData.country.YesterdayRecovered;

            countryData.global.todayVsYesterdayConfirmed = countryData.global.TodayConfirmed - countryData.global.YesterdayConfirmed;
            countryData.global.todayVsYesterdayDeaths = countryData.global.TodayDeaths - countryData.global.YesterdayDeaths;
            countryData.global.todayVsYesterdayRecovered = countryData.global.TodayRecovered - countryData.global.YesterdayRecovered;

            return countryData;
        }

        formatDateYesterday(){
            let formated = this.datePipe.transform(this.todayTimestamp, 'yyyy-MM-dd');
            let arr = formated.split('-');
            arr[2] = stringify(parseInt(arr[2])-1);
            let result = arr.join('-');
            return result;
        }
}
