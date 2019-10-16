import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Gebruiker } from 'src/app/models/gebruiker.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable()
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  gebruikers$: Observable<Gebruiker[]>;
  gebruiker: Gebruiker;
  isAuth: boolean;

  constructor(
    private _authService: AuthService, 
    private router: Router,
    private snackbar: MatSnackBar) {
      this.gebruikers$ = this._authService.getGebruikers();
   }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]})
    });
  }

  onSubmit() {
    this.gebruikers$.forEach(g => {
      this.gebruiker = g.find(g => g.email == this.loginForm.value.email);
      if (this.gebruiker) {
        if (this.gebruiker.wachtwoord == this.loginForm.value.password) {
          this.router.navigate(['/']);
        } else {
          this.snackbar.open('Wrong password!', 'Login failed', {
            duration: 3000
          });
        }
      } else {
        this.snackbar.open('Email nog existing!', 'Login failed', {
          duration: 3000
        });
      }
    });
  }
}
