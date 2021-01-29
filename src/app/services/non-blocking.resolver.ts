import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { CovidService } from './covid.service';

@Injectable({
  providedIn: 'root'
})
export class NonBlockingResolver implements Resolve<any>{

    constructor(private covidService:CovidService,
                    private route: ActivatedRoute) { }

    resolve(){
        console.log('Resolve Start; country => ', this.covidService.country);
        const dataObservable = Promise.resolve(from(this.covidService.runCountry()))
        console.log('Resolver after runCountry: => ', this.covidService.country);
            return dataObservable;
            
        
    }
    
}