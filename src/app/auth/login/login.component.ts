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

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private store: Store<{ ui: fromAuth.State }>) {
    this.users$ = this.authService.getUsers();
  }

  //FORGOT PASSWORD!!!!!
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('info@jelleceulemans.be', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('azertyuiop', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    let gebruikerLogin = new User(0, this.loginForm.value.email, this.loginForm.value.password, null, null, null, null);
    this.authService.authenticate(gebruikerLogin).subscribe(result => {
      this.authService.setUser(result);
      localStorage.setItem("token", result.token);
      this.store.dispatch(new Auth.SetAuthenticated());
      this.router.navigate(['/dashboard']);
    }, error => {
      this.store.dispatch(new Auth.SetUnauthenticated());
      this.snackbar.open('Credentials are not recognised!', 'Login failed', {
        duration: 3000
      });
    });
  }
}
