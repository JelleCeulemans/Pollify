import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Gebruiker } from 'src/app/models/gebruiker.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private snackbar: MatSnackBar, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      gebruikersnaam: new FormControl('JelleCeulemans', {validators: [Validators.required, Validators.minLength(3)]}),
      email: new FormControl('info@jelleceulemans.be', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('azertyuiop', {validators: [Validators.required, Validators.minLength(8)]}),
      repeatPassword: new FormControl('azertyuiop', {validators: [Validators.required, Validators.minLength(8)]})
    });
  }

  onSubmit() {

    //check if email already exists
    if  (this.signupForm.value.password == this.signupForm.value.repeatPassword) {
      let gebruiker = new Gebruiker(0, this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.gebruikersnaam, null, null, null);
      this.authService.insertGebruiker(gebruiker).subscribe();
      this.router.navigate(['/login']);
    } else {
      this.signupForm.setValue({
        email: this.signupForm.value.email,
        password: '',
        repeatPassword: ''
      });
      this.snackbar.open('Both passwords aren\'t identical!', 'Signup failed', {
        duration: 3000
      }); 
    }
  }
}
