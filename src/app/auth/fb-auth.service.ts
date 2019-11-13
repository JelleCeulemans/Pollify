import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({

  providedIn: 'root'

})

export class FbAuthService {

  constructor(public afAuth: AngularFireAuth) { } // Inject Firebase auth service

  // Sign in with Facebook
  facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!')
      }).catch((error) => {
        console.log(error)
      })
  }
}