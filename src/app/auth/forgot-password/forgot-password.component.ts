import { Component, OnInit } from '@angular/core';
import * as mail from 'src/assets/js/mail.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ForgotPasswordDialogComponent } from 'src/app/dialog/forgot-password-dialog/forgot-password-dialog.component';
import { Router } from '@angular/router';

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
        const forgotPasswordDialog = this.dialog.open(ForgotPasswordDialogComponent, {
          data: {
            username: result.username,
            email: result.email
          }
        });
        forgotPasswordDialog.afterClosed().subscribe(result => {
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
