import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { User } from '../interface/user';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { CovidService } from './covid.service';
import { catchError } from 'rxjs/operators';

const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private covidService: CovidService) { }


/************************************************ */
/***************** User Storage *******************/
/************************************************ */



async saveUserInfo(user:User){
  try{
    await Storage.set({
    key: 'user',
    value:JSON.stringify(user),
  })}
  catch(error){
    console.error(error);
  }
}
async getUser(): Promise<Object> {
  const ret = await Storage.get({ key: 'user' });
  const user= JSON.parse(ret.value);
  return user;
}


/************************************************* */
/**************** Healthcare Storage ***************/
/************************************************* */



//si te encuentras mal acceder al questionario
async saveQuestionsSick(answerList:any[]){
  let points;
  if(this.covidService.lat){
    points=[{lat:this.covidService.lat,lng: this.covidService.lng}]
  }
  else{
    try{
      await this.covidService.getAllLocation()
    }
    catch(error){
      console.error(error);
    }
    if(this.covidService.lat){
    points=[{lat:this.covidService.lat,lng: this.covidService.lng}]
    }

  }
  let healthy= {
    date: new Date().getTime(), //count quarentine time as pop up??
    position: points, //save para proximas updates, mapa con la geoposicion de posibles enfermos
    healthy: false,  // healthy or not
    list: answerList // true responses to get feedback on advances
  }
  try{
    await Storage.set({
      key: 'healthy',
      value:JSON.stringify(healthy),
    })
  }
  catch(error){
    console.error(error)
  }
}

async saveQuestionshealthy(answerList:any[]){
  let points;
  if(this.covidService.lat){
    points=[{lat:this.covidService.lat,lng: this.covidService.lng}]
  }
  else{
    try{
      await this.covidService.getAllLocation()
    }
    catch(error){
      console.error(error);
    }
    if(this.covidService.lat){
    points=[{lat:this.covidService.lat,lng: this.covidService.lng}]
    }

  }
  let healthy= {
    date: new Date().getTime(),
    position: points,
    healthy: true,
    list: answerList
  }
  try{
    await Storage.set({
      key: 'healthy',
      value:JSON.stringify(healthy),
    })
  }
  catch(error){
    console.error(error)
  }
}


async getHealthy(): Promise<Object> {
  const ret = await Storage.get({ key: 'healthy' });
  const healthy = JSON.parse(ret.value);
  return healthy;
}

/*************************************************** */
/***************** WorldJson Storage *****************/
/*************************************************** */

async setWorldJson(world: Object) {
  console.log(world)
  try{
    await Storage.set({
      key: 'worldJson',
      value:JSON.stringify(world),
    })
  }
  catch(error){
    console.error(error)
  }
}

async getWorldJson() {
  const ret = await Storage.get({key: 'worldJson'});
  const worldData = JSON.parse(ret.value);
  return worldData;
}


async removeItem(name:string) {
  await Storage.remove({ key: name });
}

async keys() {
  const { keys } = await Storage.keys();
  console.log('Got keys: ', keys);
  return keys;
}

async clear() {
  await Storage.clear();
}
}
