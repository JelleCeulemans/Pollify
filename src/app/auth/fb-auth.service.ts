import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from './auth.service';
import * as fromAuth from './auth.reducer';
import * as Auth from './auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class FbAuthService {
  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private store: Store<{ ui: fromAuth.State }>,
    private router: Router,
    private dialog: MatDialog) { }

  // Sign in with Facebook
  facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.afAuth.user.subscribe(user => {
          localStorage.setItem('image', user.photoURL);
          this.authService.getUserByEmail(user.email).subscribe(result => {
            if (result) {
              this.login(result);
            } else {
              let insertUser = new User(0, user.email, user.uid, user.displayName, true, '00000000-0000-0000-0000-000000000000', null, null, null);
              this.authService.insertUser(insertUser).subscribe(result => {
                result.password = user.uid;
                this.login(result);
              });
            }
          });
        });
      });
  }

  login(user: User) {
    this.authService.fbauth(user).subscribe(result => {
      localStorage.setItem('token', result.token);
      this.authService.setUser(result);
      this.store.dispatch(new Auth.SetAuthenticated());
      this.router.navigate(['/dashboard']);
    });
  }
}