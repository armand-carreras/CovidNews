import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CovidService } from '../services/covid.service';
import { DatePipe } from '@angular/common';
import { CountryData } from '../interface/country-data';
import { RegionData } from '../interface/region-data';
import { StorageService } from '../services/storage.service';
import { delay } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { AngularFireAuth } from '@angular/fire/auth';
import { FireAuthService } from '../services/fire-auth.service';
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
    worldJson:any;
    authState:any;
    logged:boolean;
    healthy:boolean;
  constructor(private route: ActivatedRoute,
            private covidService:CovidService,
            private authService: FireAuthService,
            private datePipe: DatePipe,
            private storage: StorageService) {
                this.countryData = {
                    name:'',
                    global:{},
                    country:{},
                };
                this.todayTimestamp = new Date();
                if(this.authService.logged){
                    this.logged = this.authService.logged;
                }
                else{
                    this.authService.logged = false;
                    this.logged = false;
                }
                
            }


            async ngOnInit() {
                // this.covidService.runCountry().then(resp=>console.log('runCountry UserPage',this.covidService.country)).catch(error=> console.log(error));
                
                // const response = await this.storage.getHealthy();
                // this.healthy = response['healthy'];
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
                                console.log("routeresolve",this.routeResolveData);
                                this.countryData=this.fillData(this.routeResolveData);
                                console.log("routecountry", this.countryData);
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
    

            logOut(){
                this.storage.removeItem('user');
                this.authService.logout();
                this.logged=false;
                this.authService.logged=false;
            }

            async ionViewDidEnter(): Promise<void> {
                //Called after every check of the component's view. Applies to components only.
                //Add 'implements AfterViewChecked' to the class.
                
                console.log('ionDidEnter: ', this.logged);
                this.authService.isLogged$().subscribe(resp =>{
                    if(resp && resp.uid){
                        this.logged = true;
                    }
                    else{
                        this.logged = false;
                    }
                })
                const world = await this.covidService.getDailyWorld().toPromise();
                            if(world){
                                console.log('dentro if world', world);
                                await this.storage.setWorldJson(world);
                            }
                            let worldJsonGet = await this.storage.getWorldJson();
                            console.log('storageWorldJson: ', worldJsonGet);
            }
            async ionViewWillEnter(): Promise<void> {
                const world = await this.covidService.getDailyWorld().toPromise();
                            if(world){
                                console.log('dentro if world', world);
                                await this.storage.setWorldJson(world);
                            }
                            let worldJsonGet = await this.storage.getWorldJson();
                            console.log('storageWorldJson: ', worldJsonGet);
            }


        fillData(JSONData): CountryData{
            let countryData: CountryData = {
                name:'',
                global:{},
                country:{},
            };
            let date = new Date();
            let formatedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
            let finalDate:string;
            if(parseInt(this.datePipe.transform(date,"HH"))<6){
                let formated = this.datePipe.transform(date, 'yyyy-MM-dd');
                let arr = formated.split('-');
                let diaResta = parseInt(arr[2])-1;
                if(diaResta/10<1){
                    let dayStr = diaResta.toString();
                    dayStr = '0'+dayStr;
                    arr[2] = dayStr;
                }
                else{
                    arr[2]=diaResta.toString();
                }
                formatedDate = arr.join('-');
            }
            console.log('fillData: J',JSONData);
            console.log(formatedDate)

            if(this.covidService.country_code == 'es'){
                console.log(formatedDate)
                countryData.name = JSONData.dates[formatedDate].countries[this.covidService.country].name_es;
            }
            else if(this.covidService.country_code == 'it'){
                countryData.name = JSONData.dates[formatedDate].countries[this.covidService.country].name_it;
            }
            else{
                countryData.name = JSONData.dates[formatedDate].countries[this.covidService.country].name;
            }
                countryData.global.TodayDeaths = parseInt(JSONData.total.today_deaths);
                countryData.global.TodayConfirmed = parseInt(JSONData.total.today_confirmed);
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
                console.log(countryData.country.todayVsYesterdayConfirmed);
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
