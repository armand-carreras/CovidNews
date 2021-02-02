
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FireAuthService } from '../services/fire-auth.service';
import { StorageService } from '../services/storage.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


    loginForm: FormGroup;
    isError: boolean=false;
  constructor(private formBuilder: FormBuilder,
                private router: Router,
                private authFireService: FireAuthService,
                private storeService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
  }
  private buildForm(){
    const dateLength = 10;
    const today = new Date().toISOString().substring(0, dateLength);
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required, Validators.email
      ]],
      password: ['', Validators.required]
    });
  }
 
    async signIn(){
        const result = await this.authFireService.login(this.loginForm.get('email').value,this.loginForm.get('password').value);
        console.log(result);
        let user= {
          email: this.loginForm.get('email').value,
          uid: result.user.uid
        }
        await this.storeService.saveUserInfo(user);
        console.log('login is logged? :', await this.authFireService.isLogged$().toPromise())
        // this.router.onSameUrlNavigation = 'reload';
        //this.router.navigate(['/']);
        
  
    }
     onIsError(): void {
      this.isError = true;
      setTimeout(() => {
        this.isError = false;
      }, 4000);
    }
  public getError(controlName: string): string[] {
    let error =  [];
    const control = this.loginForm.get(controlName);
    if (control.touched && control.errors != null) {
     // error = JSON.stringify(control.errors);
      error = [...Object.keys(control.errors)];
    }
    return error;
  }
}
