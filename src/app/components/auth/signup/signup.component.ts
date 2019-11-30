import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { OneOptionDialogComponent } from 'src/app/dialogs/one-option-dialog/one-option-dialog.component';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  //declarations
  signupForm: FormGroup;
  showSpinner: boolean;

  //Subscription
  private valueSub: Subscription;


  //password validation variables
  lowercase: boolean;
  uppercase: boolean;
  numeric: boolean;
  specialCharacter: boolean;
  length: boolean;
  identical: boolean

  //Making all the necessary services available
  constructor(
    private snackbar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private emailService: EmailService) { }

  //Is executing while initializing the component
  ngOnInit() {
    //All the validation variables are false by default.
    this.lowercase = false;
    this.uppercase = false;
    this.numeric = false;
    this.specialCharacter = false;
    this.length = false;
    this.identical = false;

    //The spinner is set to false by default
    this.showSpinner = false;

    //Creating a signup form with validation rules
    //The username has to be required and at least 3 characters long
    //The email is required and has to be a valid email
    //The password field is required and has to contain:
    //at least 1 lowercase character, 1 uppercase charachter, a number, a special character and also at least 8 characters long. 
    this.signupForm = new FormGroup({
      username: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required, Validators.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))] }),
      confirmPassword: new FormControl('', { validators: [Validators.required] })
    });

    //Make the password validation section active
    this.validatePassword();
  }

  //When the user click on the submit button
  onSubmit() {
    //The spinners is now visible and the submit button is now hidden
    this.showSpinner = true;
    //If the passsword and confirm password are identical
    if (this.identical) {
      //Check if the email is already connected to a user.
      this.userService.getUserByEmail(this.signupForm.value.email).subscribe(result => {
        //If the user already exists
        if (result) {
          //If the username and password attribute contains null
          if (!result.username && !result.password) {
            //set the username and password attribute equal to the values given in the form
            result.username = this.signupForm.value.username;
            result.password = this.signupForm.value.password;
            //Update the user in the database
            this.userService.updateUser(result).subscribe(result => {
              //Send an email with an activation link
              this.sendActivationMail(result);
              //Stop the spinner
              this.showSpinner = false;
              //Open the one option dialig
              this.showOneOptionDialog();

            });
          } else {
            //If this account already exists in the database
            //Show a snackbar and remove the password values from the form
            //There will be a snackbar visible that the account already exists
            this.showSnackbarAndCleanForm('Email already exists!', 'Signup failed');
          }
          //If the user doesn't exist
        } else {
          //New user will be inserted into the database
          let user = new User(0, this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.username, false, '00000000-0000-0000-0000-000000000000', null, null, null);
          this.userService.insertUser(user).subscribe(result => {
            //Send an email with an activation link
            this.sendActivationMail(result);
            //Stop the spinner
            this.showSpinner = false;
            //Open the one option dialig
            this.showOneOptionDialog();
          });
        }
      });
      //If both passwords aren't identical
    } else {
      //Show a snackbar and remove the password values from the form
      //This snackbar shows that both passwords aren't identical
      this.showSnackbarAndCleanForm('Both passwords aren\'t identical!', 'Signup failed');
    }
  }

  //Send an email with an activation link
  sendActivationMail(user: User) {
    this.emailService.activationLink(user).subscribe();
  }

  //To avoid duplicate code
  //Remobe the password values
  //shows a snackbar for 3 seconds with a given title and content
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
    this.showSpinner = false;
  }

  //To make the onSubmit function a little shorten and readable
  //Opens a one option dialog
  //Inform the person that his account is created and aan activation link is sended.
  showOneOptionDialog() {
    const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
      data: {
        title: "Account created!",
        content: "<p>" + this.signupForm.value.username + " your account has just been created!</p><p>There is an email sent to you email address: " + this.signupForm.value.email + " with an activation link.</p><p>Please activate your account, before you are able to login.</p>",
        button: "Go to Login"
      }
    });
    oneOptionDialog.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/login']);
      }
    });
  }

  //This validators will displays which requirements he still need in his password.
  validatePassword() {
    this.valueSub = this.signupForm.valueChanges.subscribe(result => {
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
  ngOnDestroy() {
    this.valueSub.unsubscribe();
  }
}
