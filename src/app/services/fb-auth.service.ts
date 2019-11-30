import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import * as fromAuth from '../components/auth/auth.reducer';
import * as Auth from '../components/auth/auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class FbAuthService {

  //Make all the necessary services available
  constructor(
    public afAuth: AngularFireAuth,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private store: Store<{ ui: fromAuth.State }>,
    private router: Router) { }

  //Sign in with Facebook
  facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  //Auth logic to run auth providers
  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.afAuth.user.subscribe(user => {
          //Set the image to in the localStorage and emit it
          this.localStorageService.setImage(user.photoURL);
          //Check if the email is in the database
          this.userService.getUserByEmail(user.email).subscribe(result => {
            //If the email is connected to an user
            if (result) {
              //Run the login function
              this.login(result);

              //If the user is not in the database
            } else {
              //Create a new user from the fb user object
              let insertUser = new User(0, user.email, user.uid, user.displayName, true, '00000000-0000-0000-0000-000000000000', null, null, null);
              this.userService.insertUser(insertUser).subscribe(result => {
                //Run the login function
                this.login(result);
              });
            }
          });
        });
      });
  }

  //Login the user
  login(user: User) {
    //Authenticate the user to receive a token
    this.userService.fbauth(user).subscribe(result => {
      //Set the token in the localStorage
      this.localStorageService.setToken(result.token);
      //Set the user in the localStorage and emit it
      this.localStorageService.setUser(result);
      //Change the state to authenticated
      this.store.dispatch(new Auth.SetAuthenticated());
      //Redirect to the dashboard
      this.router.navigate(['/dashboard']);
    });
  }
}