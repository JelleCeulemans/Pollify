import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { OneOptionDialogComponent } from 'src/app/dialog/one-option-dialog/one-option-dialog.component';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  showSpinner: boolean;

  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) { }


  //Is executing when the forgot password page is initializing.
  //This will set default the spinner to false (button will be visible).
  //And creates an Formgroup for the email input field to get add validation automatically.
  ngOnInit() {
    this.showSpinner = false;
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
  }


  //Is execited when the forgot password button is pressed.
  onSubmit() {
    //This will show the spinner and hide the button.
    this.showSpinner = true;
    
    //FIXME
    ////////email ????

    this.authService.getUserByEmail(this.forgotPasswordForm.value.email, true).subscribe(result => {
      //if the given email is in the database
      if (result) {
        //This will show a one option dialog with the content of the data object.
        const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
          data: {
            title: "Reset Password",
            content: "<p>" + result.username + " there is an email send to following email address: " + result.email + " to reset your password</p><p>Please go to your email to reset your password</p>",
            button: "OK"
          }
        });
        //When the button (OK) is pressed or the dialog is closed by clicking on the page arorund to the dialog then
        //the user will be redirected to the inlog page.
        oneOptionDialog.afterClosed().subscribe(result => {
          this.router.navigate(['/login']);
        });
        //If the given email is not in the database
        //This will show a snackbar with "Email not recognized" for 3 seconds.
      } else {
        this.snackbar.open('Email not recognized', 'Error', {
          duration: 3000
        });
      }
      //This will hide the spinner and show the button
      this.showSpinner = false;
    });
  }
}
