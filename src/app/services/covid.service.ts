import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { tap, delay, finalize } from 'rxjs/operators';
// import { Plugins } from '@capacitor/core';
// const { Geolocation } = Plugins;
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { stringify } from '@angular/compiler/src/util';
import { StorageService } from './storage.service';

@Injectable()

export class CovidService {
    lat:number;
    lng:number;
    country: string;
    country_code:string;
    region: string;
    sub_region: string;
    WolrdData: Object;
    constructor(private http: HttpClient,
                private datePipe: DatePipe,
                private geolocation: Geolocation,
                private locationAccuracy: LocationAccuracy) {

                    console.log('covidService:', 'starting')
                    
                }

    
    


    async getAllLocation(){
        let position;
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {

            if(canRequest) {
              // the accuracy option will be ignored by iOS
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => console.log('Request successful'),
                    error => console.log('Error requesting location permissions', error)
                );
            }
        
            });
        try{
            
                position = await this.geolocation.getCurrentPosition();
                console.log('getAllLocation position android: ',JSON.stringify(position));
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                
            console.warn('promt position: ', JSON.stringify(position))
            
            await this.getLocationInfo();
        }
        catch(error){
            console.warn(error);
        }
    }



    async runCountry(): Promise<any>{
        try{
            await this.getAllLocation();
            console.log('entering getDailyCountry from runCountry if: country => ', this.country)
            const promiseObservable = this.getDailyCountry$(this.country).toPromise();
            return promiseObservable;
        }
        catch(error){console.warn(error)}
        
    }




    locateCurrentPosition = () => new Promise((resolve,reject)=> {
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log('locateCurrentPosition', position);
            resolve(position);
          },
          error => {
            console.error(error.message);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 1000
          }
        );
      });



    async getLocationInfo(){
        // let header = new HttpHeaders();
        // header = header.set('Content-Language', 'en-US')
        try{
            console.log('geocoder url: ', `https://api.opencagedata.com/geocode/v1/json?q=${this.lat}+${this.lng}&key=a3b87fc96efa44538d6ed8b6e23487a0`);
            let resp = await this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${this.lat}+${this.lng}&language=en&key=a3b87fc96efa44538d6ed8b6e23487a0`).toPromise()
            this.country = resp['results'][0].components.country;
            this.country_code = resp['results'][0].components.country_code;
            console.log('LocationInfo Result: )',JSON.stringify(resp['results']))
            console.log('LocationInfo Result: )',(resp['results']))
            console.log('LocationInfo Result: )',(JSON.stringify(resp['results'][0])))

        }
        catch(error){
            console.error(error);
        }

    }

    getDailyWorld():Observable<Object>{
        let date = new Date();
        console.log(this.datePipe.transform(date,"yyyy-MM-dd"));
        let formatedDate = this.datePipe.transform(date,"yyyy-MM-dd");
        if(parseInt(this.datePipe.transform(date,"HH"))<6){
            let formated = this.datePipe.transform(date, 'yyyy-MM-dd');
            let arr = formated.split('-');
            arr[2] = stringify(parseInt(arr[2])-1);
            formatedDate = arr.join('-');
        }
        let response;
        console.log(`https://api.covid19tracking.narrativa.com/api/${formatedDate}`);
        return this.http.get(`https://api.covid19tracking.narrativa.com/api/${formatedDate}`)
        
}

    getDailyCountry$(country): Observable<any>{
                let date = new Date();
                console.log(this.datePipe.transform(date,"yyyy-MM-dd"));
                let formatedDate = this.datePipe.transform(date,"yyyy-MM-dd");
                if(parseInt(this.datePipe.transform(date,"HH"))<6){
                    let formated = this.datePipe.transform(date, 'yyyy-MM-dd');
                    let arr = formated.split('-');
                    arr[2] = stringify(parseInt(arr[2])-1);
                    formatedDate = arr.join('-');
                }if(this.country == 'United States'){
                    this.country = 'US';
                }
                else if(this.country.split(' ').length>1){
                    this.country.split(' ').join('_')
                }
                console.log(`https://api.covid19tracking.narrativa.com/api/${formatedDate}/country/${this.country}`);
            const dataObservable = this.http.get(`https://api.covid19tracking.narrativa.com/api/${formatedDate}/country/${this.country}`).pipe(
                tap(val => {
                    console.log('getData STARTED');
                }),
                delay(2000),
                finalize(() => {
                    console.log('getData COMPLETED');
                })
                );
            return dataObservable;

    }
    
    

    getCountriesList$(): Observable<any>{
        const dataObservable = this.http.get(`https://api.covid19tracking.narrativa.com/api/countries`);
        return dataObservable;
    }
    
}