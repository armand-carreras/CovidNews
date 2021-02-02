import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FireAuthService } from './fire-auth.service';
// import { auth } from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
    constructor(
        private authFireService: FireAuthService, 
        private router: Router) { }
  async canLoad(
    route: Route,
    segments: UrlSegment[]){

    const user = await this.authFireService.isLogged$().toPromise();
      if (user && user.uid) {
        return true;
      }
      else {
        this.router.navigate(['/login']);
        return false;

      }
  }
} 