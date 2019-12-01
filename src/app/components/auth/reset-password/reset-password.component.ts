import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { OneOptionDialogComponent } from 'src/app/dialogs/one-option-dialog/one-option-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  guid: string;
  user: User;
  show: boolean;

  //Subscriptions
  private urlParam: Subscription;
  private userByGuid: Subscription;
  private valueSub: Subscription;
  private updatePassword: Subscription;
  private dialogSubscription: Subscription;

  //password validation variables
  lowercase: boolean;
  uppercase: boolean;
  numeric: boolean;
  specialCharacter: boolean;
  length: boolean;
  identical: boolean

  //Make all the necessary services available
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
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
    //Get the parameter from the url
    this.urlParam = this.route.params.subscribe(params => {
      //get the user with the given guid
      this.userByGuid = this.userService.getUserWhereGuid(params['guid']).subscribe(result => {
        //the user that needs to be updated
        this.user = result;
        //show the new password form
        this.show = true;
      }, error => {
        //show the error window
        this.show = false;
      });
    });

    //Executing the password validation
    this.validatePassword();
  }

  //Pressed on the Reset Password button
  onSubmit() {
    //If both passwords are identicak
    if (this.identical) {
      this.user.password = this.resetPasswordForm.value.password;
      this.updatePassword = this.userService.updatePassword(this.user).subscribe(result => {
        //show the dialog
       this.showDialog();
      });
      //If both passwords aren't identical
    } else {
      //show a snackbar the passwords aren't identical
      this.snackbar.open('Both passwords aren\'t identical!', 'Password reset failed', {
        duration: 3000
      });
      //remove the password values from the form
      this.resetPasswordForm.setValue({
        password: '',
        confirmPassword: '',
      });
    }
  }

  //Show a dialog with the info that the user's account is updated with the new password.
  //Makes the code a bit more readable
  showDialog() {
    const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
      data: {
        title: "Reset Password",
        content: "<p>" + this.user.username + " your password has been reset.</p><p>You are now able to login with your new password.</p>",
        button: "OK"
      }
    });
    //Naviate to the login screen if the user presses the OK button
    this.dialogSubscription = oneOptionDialog.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/login']);
      }
    });
  }

  //Password validation section
  validatePassword() {
    this.valueSub = this.resetPasswordForm.valueChanges.subscribe(result => {
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

  //Unsubscribe all the subscriptions to avoid data leaks
  ngOnDestroy() {
    this.urlParam.unsubscribe();
    this.userByGuid.unsubscribe();
    this.valueSub.unsubscribe();
    this.updatePassword ? this.updatePassword.unsubscribe() : false;
    this.dialogSubscription ? this.dialogSubscription.unsubscribe() : false;
  }
}
