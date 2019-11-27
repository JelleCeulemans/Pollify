import { Component, Injectable} from '@angular/core';
import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as Auth from './auth/auth.actions';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent {
  isAuthenticated$: Observable<boolean>;
  receivedInvitations: number;
  user: User;
  title = 'Pollify';
  image: string;
  
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
    this.authService.sendFriends$.subscribe(result => {
      this.receivedInvitations = result;
    });

    //When the user is logged in his credentials will be emitted to this parent
    //This way is used because this ngOnInit never reloads when the route changes. 
    this.authService.sendUser$.subscribe(result => {
      this.user = result;
    });

    //Recieves the user object after the user is logged in
    let fbImage = localStorage.getItem('image');
    this.user = this.authService.getUser();
    if (fbImage) {
      this.image = fbImage;
    }

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
    localStorage.removeItem('image');
    this.router.navigate(['/login']);
  }
}
