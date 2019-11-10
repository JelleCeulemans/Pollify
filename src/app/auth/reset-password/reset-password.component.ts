import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { OneOptionDialogComponent } from 'src/app/dialog/one-option-dialog/one-option-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  private sub: any;
  guid: string;
  user: User;
  show: boolean;

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] })
    });
    this.sub = this.route.params.subscribe(params => {
      this.authService.getUserWhereGuid(params['guid']).subscribe(result => {
        this.user = result;
        this.show = true;
      }, error => {
        this.show = false;
      });
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.value.password == this.resetPasswordForm.value.confirmPassword) {
      this.user.password = this.resetPasswordForm.value.password;
      this.authService.updatePassword(this.user).subscribe(result => {
        const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
          data: {
            title: "Reset Password",
            content: "<p>"+ this.user.username +" your password has been reset.</p><p>You are now able to login with your new password.</p>",
            button: "OK"
          }
        });
        oneOptionDialog.afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate(['/login']);
          }
        });
      });
    } else {
      this.snackbar.open('Both passwords aren\'t identical!', 'Password reset failed', {
        duration: 3000
      });
      this.resetPasswordForm.setValue({
        password: '',
        confirmPassword: '',
      });
    }
  }
}
