import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validateBasis } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]}),
      repeatPassword: new FormControl('', {validators: [Validators.required]})
    });
  }

  onSubmit() {
    if  (this.signupForm.value.password == this.signupForm.value.repeatPassword) {

    } else {
      this.snackbar.open('Both passwords aren\'t identical!', 'Signup failed', {
        duration: 3000
      });
      this.signupForm.value.password == '';
      this.signupForm.value.repeatPassword == '';
    }
  }
}
