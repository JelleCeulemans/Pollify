import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromAuth from '../auth.reducer';
import * as Auth from '../auth.actions';
import { User } from 'src/app/models/user.model';
import { FbAuthService } from '../../../services/fb-auth.service';
import { UserService } from 'src/app/services/user.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable()
export class LoginComponent implements OnInit, OnDestroy {
  //declarations
  loginForm: FormGroup;
  user: User;
  public showSpinner: boolean;

  //Subscription
  private authenticate: Subscription;

  //Make the necessary services available
  constructor(
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private snackbar: MatSnackBar,
    private store: Store<{ ui: fromAuth.State }>,
    private fbAuthService: FbAuthService) {
  }

  //Is executing when the login page is initializing
  ngOnInit() {
    //The spinner is not shown by default
    this.showSpinner = false;
    //Creates a FromGroup for the login form with validation rules.
    //The email is requires and has to be valid
    //The password is requird
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  //When the submit button is pressed
  onSubmit() {
    //The spinner is now shown and the login buttons hided
    this.showSpinner = true;
    //Try to login with the given credentials
    let userLogin = new User(0, this.loginForm.value.email, this.loginForm.value.password, null, true, '00000000-0000-0000-0000-000000000000', null, null, null);
    this.authenticate = this.userService.authenticate(userLogin).subscribe(result => {
      // the user successfully logged in

      //spinner is stopped
      //user is saved an emitted
      //state is set to authenticated
      //navigated to dashboard
      this.showSpinner = false;
      this.localStorageService.setUser(result);
      this.localStorageService.setToken(result.token);
      this.store.dispatch(new Auth.SetAuthenticated());
      this.router.navigate(['/dashboard']);
    }, error => {
      //If has not given the right credentials

      //Spinner is stopped
      this.showSpinner = false;

      //State is set to unauthenticated
      this.store.dispatch(new Auth.SetUnauthenticated());

      //Snackbar is shown that the user has given the wrong credentials or is not activated
      this.snackbar.open('Credentials are not recognized or account is not activated', 'Login failed', {
        duration: 3000
      });

      //Removed password from the form
      this.loginForm.setValue({
        email: this.loginForm.value.email,
        password: '',
      });
    });
  }

  //Pressed the Facebook login button
  fbLogin() {
    //Spinner is shown and buttons hided
    this.showSpinner = true;
    //Try to login via facebook
    this.fbAuthService.facebookAuth()
    .then(res => {
      //Spinner is stopped
      this.showSpinner = false;
    });
  }

  //Unsubscribe the subscription to avoid data leaks
  ngOnDestroy() {
    this.authenticate ? this.authenticate.unsubscribe() : false;
  }
}
