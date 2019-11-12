import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as mail from 'src/assets/js/mail.js';
import { User } from 'src/app/models/user.model';
import { AESEncryptDecryptService } from '../aesencrypt-decrypt-service.service';
import { CreateUserDialogComponent } from 'src/app/dialog/create-user-dialog/create-user-dialog.component';

declare var sendActivition: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  spinnerActive: boolean;

  constructor(
    private snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private _AESEncryptDecryptService: AESEncryptDecryptService) { }

  ngOnInit() {
    this.spinnerActive = false;
    this.signupForm = new FormGroup({
      username: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
      repeatPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] })
    });
  }

  onSubmit() {
    //look for all sort of things that can happen (dialog and snackbar)
    this.spinnerActive = true;
    if (this.signupForm.value.password == this.signupForm.value.repeatPassword) {
      this.authService.getUserByEmail(this.signupForm.value.email).subscribe(result => {
        if (result) {
          if (!result.username && !result.password) {
            result.username = this.signupForm.value.username;
            result.password = this.signupForm.value.password;
            this.authService.updateUser(result).subscribe(result => {
              this.activationLink(result.email, result.username, result.guid);
              this.router.navigate(['/login']);
            });
          } else {
            this.snackbar.open('Email already exists!', 'Signup failed', {
              duration: 3000
            });
            this.signupForm.setValue({
              username: this.signupForm.value.username,
              email: '',
              password: '',
              repeatPassword: ''
            });
            this.spinnerActive = false;
          }
        } else {
          let user = new User(0, this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.username, false, '00000000-0000-0000-0000-000000000000', null, null, null);
          this.authService.insertUser(user).subscribe(result => {
            console.log(result);
            this.activationLink(result.email, result.username, result.guid);
            const createUserDialog = this.dialog.open(CreateUserDialogComponent, {
              data: {
                username: this.signupForm.value.username,
                email: this.signupForm.value.email
              }
            });
            createUserDialog.afterClosed().subscribe(result => {
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
      this.signupForm.setValue({
        username: this.signupForm.value.username,
        email: this.signupForm.value.email,
        password: '',
        repeatPassword: ''
      });
      this.snackbar.open('Both passwords aren\'t identical!', 'Signup failed', {
        duration: 3000
      });
      this.spinnerActive = false;
    }
  }

  activationLink(email: string, username: string, guid: string) {
    sendActivition(email, username, guid);
    this.snackbar.open('Email activation link is sended!', 'Email', {
      duration: 3000
    });
    this.spinnerActive = false;
  }
}
