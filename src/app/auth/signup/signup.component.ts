import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
//import * as mail from 'src/assets/js/mail.js';
import { User } from 'src/app/models/user.model';
import { OneOptionDialogComponent } from 'src/app/dialog/one-option-dialog/one-option-dialog.component';

//declare var sendActivition: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  spinnerActive: boolean;

  //password validation variables
  lowercase: boolean;
  uppercase: boolean;
  numeric: boolean;
  specialCharacter: boolean;
  length: boolean;
  identical: boolean

  constructor(
    private snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    //All the validation variables are false by default.
    this.lowercase = false;
    this.uppercase = false;
    this.numeric = false;
    this.specialCharacter = false;
    this.length = false;
    this.identical = false;

    this.spinnerActive = false;
    this.signupForm = new FormGroup({
      username: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required, Validators.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))] }),
      confirmPassword: new FormControl('', { validators: [Validators.required, Validators.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))] })
    });
    this.validatePassword();
  }

  onSubmit() {
    this.spinnerActive = true;
    if (this.identical) {
      this.authService.getUserByEmail(this.signupForm.value.email, false).subscribe(result => {
        if (result) {
          if (!result.username && !result.password) {
            result.username = this.signupForm.value.username;
            result.password = this.signupForm.value.password;
            this.showSnackbarAndCleanForm('Email activation link is sended!', 'Email');
          } else {
            //FIXME 
            //remove email from template!!!!
            this.showSnackbarAndCleanForm('Email already exists!', 'Signup failed');
          }
        } else {
          let user = new User(0, this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.username, false, '00000000-0000-0000-0000-000000000000', null, null, null);
          this.authService.insertUser(user).subscribe(result => {
            this.snackbar.open('Email activation link is sended!', 'Email', {
              duration: 3000
            });
            this.spinnerActive = false;
            const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
              data: {
                title: "Reset Password",
                content: "<p>" + this.signupForm.value.username + " your account has just been created!</p><p>There is an email sent to you email address: " + this.signupForm.value.email + " with an activation link.</p><p>Please activate your account, before you are able to login.</p>",
                button: "Go to Login"
              }
            });
            oneOptionDialog.afterClosed().subscribe(result => {
              if (result) {
                this.router.navigate(['/login']);
              }
            });
          }, error => {
            this.snackbar.open('Account creation failed!', 'Signup failed', {
              duration: 3000
            });
            this.spinnerActive = false;
          });
        }
      });
    } else {
      this.showSnackbarAndCleanForm('Both passwords aren\'t identical!', 'Signup failed');
    }
  }

  showSnackbarAndCleanForm(content: string, title: string) {
    this.signupForm.setValue({
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: '',
      confirmPassword: ''
    });
    this.snackbar.open(content, title, {
      duration: 3000
    });
    this.spinnerActive = false;
  }

  validatePassword() {
    this.signupForm.valueChanges.subscribe(result => {
      //If the password contains a lowercase letter
      this.lowercase = new RegExp('(?=.*[a-z])').test(result.password) ? true : false;

      //If the password contains a uppercase letter
      this.uppercase = new RegExp('(?=.*[A-Z])').test(result.password) ? true : false;

      //If the password contains a number
      this.numeric = new RegExp('(?=.*[0-9])').test(result.password) ? true : false;

      //If the password contains a special character
      this.specialCharacter = new RegExp('(?=.*[!@#\$%\^&\*])').test(result.password) ? true : false;

      //If the password is at least 8 characters long
      this.length = new RegExp('(?=.{8,})').test(result.password) ? true : false;

      //If the password and confirm password is identical
      this.identical = result.password == result.confirmPassword ? true : false;
    });
  }
}
