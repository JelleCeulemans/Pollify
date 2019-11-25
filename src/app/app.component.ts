import { Component, Injectable} from '@angular/core';
import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as Auth from './auth/auth.actions';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent {
  isAuthenticated$: Observable<boolean>;
  receivedInvitations: number;
  title = 'Pollify';
  
  constructor(
    private store: Store<fromRoot.State>, 
    private router: Router, 
    private authService: AuthService) { }

  //Is executed when the the complete app is initializing
  ngOnInit() {
    //Keeps the users logged in when they refreshes the page
    //If they still got a token, they will be directed to the page where they refreshed the page.
    //And the isAuthenticated state will be set to true
    if (localStorage.getItem('token')) {
      this.router.navigate([window.location.pathname]);
      this.store.dispatch(new Auth.SetAuthenticated());
    }

    //When de user is directed to the dashboard page, a method is fired to check if he has recieved some friend request.
    //This one is subscribed to recieve that desired information.
    //If the user has more than zero friend requests a badge will be displayed with the amount of friend requests on the toolbar.
    this.authService.changeEmitted$.subscribe(result => {
      this.receivedInvitations = result;
    });

    //Will check if the user is authenticated.
    //If he is authenticated het gets access to the app.
    this.isAuthenticated$ = this.store.select(fromRoot.getIsAuth);
  }

  //Is executed when the user clicks on the logout button
  //This will set the isAuthenticated state to false
  //Remove all the localStorage variables
  //And will redirect the user to the login page.
  logout() {
    this.store.dispatch(new Auth.SetUnauthenticated());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
