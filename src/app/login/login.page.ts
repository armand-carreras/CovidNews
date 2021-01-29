import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FireAuthService } from '../services/fire-auth.service';
import { StoreService } from '../services/store.service';

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
                private storeService: StoreService) { }

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
 
    async signIn(user){
        const result = await this.authFireService.login(user);
        const token  = await result.user.getIdToken();
        console.log(result);
        // this.storeService.
        // localStorage.setItem('accessToken', token);
        this.router.onSameUrlNavigation = 'reload';
        //this.router.navigate(['/']);
        this.router.navigate([`/questions`]);
  
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
