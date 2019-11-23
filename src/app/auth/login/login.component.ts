import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromAuth from '../auth.reducer';
import * as Auth from '../auth.actions';
import { User } from 'src/app/models/user.model';
import { FbAuthService } from '../fb-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable()
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  users$: Observable<User[]>;
  user: User;
  spinnerActive: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private store: Store<{ ui: fromAuth.State }>,
    private fbAuthService: FbAuthService) {
    this.users$ = this.authService.getUsers();
  }

  ngOnInit() {
    this.spinnerActive = false;
    this.loginForm = new FormGroup({
      email: new FormControl('info@jelleceulemans.be', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('azertyuiop', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this.spinnerActive = true;
    let userLogin = new User(0, this.loginForm.value.email, this.loginForm.value.password, null, true, '00000000-0000-0000-0000-000000000000', null, null, null);
    this.authService.authenticate(userLogin).subscribe(result => {
      this.authService.setUser(result);
      localStorage.setItem('token', result.token);
      this.spinnerActive = false;
      this.store.dispatch(new Auth.SetAuthenticated());
      this.router.navigate(['/dashboard']);
    }, error => {
      this.spinnerActive = false;
      this.store.dispatch(new Auth.SetUnauthenticated());
      this.snackbar.open('Credentials are not recognised or account is not activated', 'Login failed', {
        duration: 3000
      });
      this.loginForm.setValue({
        email: this.loginForm.value.email,
        password: '',
      });
    });
  }

  fbLogin() {
    this.fbAuthService.facebookAuth();
  }
}
