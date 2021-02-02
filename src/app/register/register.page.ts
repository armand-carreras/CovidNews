import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { User } from '../interface/user';
import { FireAuthService } from '../services/fire-auth.service';
import { TokenStorageService } from '../services/token-storage.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  error: any;
    user:User;
    registerForm: FormGroup;


constructor(private fireAuth: FireAuthService,
            private formBuilder: FormBuilder,
            private router: Router,
            private storeService:TokenStorageService,) { 
                const dateLength = 10;
                
                const today = new Date().toISOString().substring(0, dateLength);
    this.registerForm = this.formBuilder.group({
        registeredOn: today,
        name:['',Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    })
}
    ngOnInit(): void {
    }

    async signUp(){
        
        this.user = {
            registeredAt: this.registerForm.get('registeredOn').value,
            name: this.registerForm.get('name').value,
            email: this.registerForm.get('email').value,
            password: this.registerForm.get('password').value,
        }
        // this.fireUserService.create(this.user);
        
        let registerResult = await this.fireAuth.register(this.user);
        console.log(registerResult);
        let logged = await this.fireAuth.login(this.user.email, this.user.password);
        console.log(logged);
        const user = await this.fireAuth.isLogged$().toPromise();
        if(user.uid){
            this.fireAuth.logged=true;
        }
        else{
            this.fireAuth.logged = false;
        }
    }

    
}

