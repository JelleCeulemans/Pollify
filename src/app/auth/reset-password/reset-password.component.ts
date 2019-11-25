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
  private urlParam: any;
  guid: string;
  user: User;
  show: boolean;

  //password validation variables
  lowercase: boolean;
  uppercase: boolean;
  numeric: boolean;
  specialCharacter: boolean;
  length: boolean;
  identical: boolean

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) { }

  //Is executing when initializing the reset password page.
  ngOnInit() {
    //All the validation variables are false by default.
    this.lowercase = false;
    this.uppercase = false;
    this.numeric = false;
    this.specialCharacter = false;
    this.length = false;
    this.identical = false;

    //Creates an FormGroup for the reset password form with validation rules
    //At least 1 Uppercase, 1 lowercase, 1 spacial character, 1 number and 8 characters long
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', { validators: [Validators.required,  Validators.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))] }),
      confirmPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] })
    });
    this.urlParam = this.route.params.subscribe(params => {
      this.authService.getUserWhereGuid(params['guid']).subscribe(result => {
        this.user = result;
        this.show = true;
      }, error => {
        this.show = false;
      });
    });

    //Executing the password validation
    this.validatePassword();
  }

  onSubmit() {
    if (this.identical) {
      this.user.password = this.resetPasswordForm.value.password;
      this.authService.updatePassword(this.user).subscribe(result => {
        const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
          data: {
            title: "Reset Password",
            content: "<p>" + this.user.username + " your password has been reset.</p><p>You are now able to login with your new password.</p>",
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

  validatePassword() {
    this.resetPasswordForm.valueChanges.subscribe(result => {
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
