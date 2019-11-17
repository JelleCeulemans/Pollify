import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from './auth.service';
import * as fromAuth from './auth.reducer';
import * as Auth from './auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { OneOptionDialogComponent } from '../dialog/one-option-dialog/one-option-dialog.component';
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
          console.log(user);
          
          this.authService.getUserByEmail(user.email).subscribe(result => {
            if (result) {
              //Create easier authentication for fb ? Security issue
              result.password = user.uid;
              this.login(result);
            } else {
              let insertUser = new User(0, user.email, user.uid, user.displayName, true, '00000000-0000-0000-0000-000000000000', null, null, null);
              this.authService.insertUser(insertUser).subscribe(result => {
                //Create easier authentication for fb ? Security issue
                result.password = user.uid;
                this.login(result);
              });
            }
          });
        });
      }).catch((error) => {
        console.log('Not able to login'); // show oneOption dialog
        console.log(error);
      })
  }
  // logout() {
  //   this.afAuth.auth.signOut().then(() => {
  //     //logout logic (routing other page)
  //   });
  // }

  login(user: User) {
    this.authService.authenticate(user).subscribe(result => {
      this.authService.setUser(result);
      localStorage.setItem("token", result.token);
      this.store.dispatch(new Auth.SetAuthenticated());
      this.router.navigate(['/dashboard']);
    }, error => {
      const oneOptionDialog = this.dialog.open(OneOptionDialogComponent, {
        data: {
          title: "Facebook login error",
          content: "<p>You are not able to login with facebook.</p><p>Maybe you have changed your password earlier ?</p><p>Go to the forgot password section to reset your password.</p><p><i>After this you are only able to login normally and not with the facebook option (all you polls are then still available).</i></p>",
          button: "OK"
        }
      });
    });
  }
}