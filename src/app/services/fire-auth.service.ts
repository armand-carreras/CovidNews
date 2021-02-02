import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../interface/user';
@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  logged:boolean;

  constructor(private afAuth: AngularFireAuth) {}

  login(email,password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
}
  logout(){
    this.afAuth.signOut();
  }

  register(user): Promise<any>{
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  isLogged$() {
    return  this.afAuth.authState;
  }
}