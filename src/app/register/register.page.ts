import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { User } from '../interfaces/user';
import { FireUserService } from '../services/fire-user.service';
import { StoreService } from '../services/store.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  error: any;
    user:User;
    registerForm: FormGroup;


constructor(private firebaseAuthentication: FirebaseAuthentication,
            private formBuilder: FormBuilder,
            private storeService:StoreService,
            private fireUserService: FireUserService) { 
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

    signUp(){
        
        this.user = {
            registeredAt: this.registerForm.get('registeredOn').value,
            name: this.registerForm.get('name').value,
            email: this.registerForm.get('email').value,
            password: this.registerForm.get('password').value,
        }
        this.fireUserService.create(this.user);
        
        this.firebaseAuthentication.createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }

    
}

