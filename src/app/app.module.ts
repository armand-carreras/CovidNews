import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CovidService } from './services/covid.service';
import { FireAuthService } from './services/fire-auth.service';
import { DatePipe } from '@angular/common';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { TokenStorageService } from './services/token-storage.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ChartComponent } from './chart/chart.component';
import { StorageService } from './services/storage.service';
import { FilterPipe } from './services/filter.pipe';


// import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CovidService,
    FireAuthService,
    DatePipe,
    Geolocation,
    LocationAccuracy,
    TokenStorageService,
    StorageService,
    FirebaseAuthentication,
    ChartComponent,
    FilterPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
