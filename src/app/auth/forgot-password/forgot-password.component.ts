import { Component, OnInit } from '@angular/core';
import * as mail from 'src/assets/js/mail.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { OneOptionDialogComponent } from 'src/app/dialog/one-option-dialog/one-option-dialog.component';

declare var resetPassword: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  show: boolean;

  constructor(
    private authService: AuthService, 
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.show = false;
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('info@jelleceulemans.be', { validators: [Validators.required, Validators.email] })
    });
  }

  onSubmit() {
    this.show = true;
    this.authService.getUserByEmail(this.forgotPasswordForm.value.email).subscribe(result => {
      if (result) {
        resetPassword(result.email, result.username, result.guid);

        const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
          data: {
            title: "Reset Password",
            content: "<p>"+ result.username +" there is an email send to following email address: "+ result.email +" to reset your password</p><p>Please go to your email to reset your password</p>",
            button: "OK"
          }
        });

        oneOptionDialog.afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.snackbar.open('Email not recognized', 'Error', {
          duration: 3000
        });
      }
      this.show = false;
    });
  }
}
