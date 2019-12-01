import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';
import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as Auth from './components/auth/auth.actions';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { LocalStorageService } from './services/localStorage.service';
import { FriendService } from './services/friend.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent implements OnInit, OnDestroy {
  //declarations
  title = 'Pollify';
  isAuthenticated$: Observable<boolean>;
  receivedInvitations: number;
  user: User;
  image: string;

  //Subscriptions
  private sendFriends: Subscription;
  private sendUser: Subscription;
  private sendImage: Subscription;

  //Making the necessary services available
  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private userService: UserService,
    private friendService: FriendService,
    private localStorageService: LocalStorageService) { }

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
    this.sendFriends = this.friendService.sendFriends$.subscribe(result => {
      this.receivedInvitations = result;
    });

    //When the user is logged in his credentials will be emitted to this parent
    //This subspciption will received the emitted user
    this.sendUser = this.localStorageService.sendUser$.subscribe(result => {
      this.user = result;
    });

    //Get the user if the user refreshes the page
    this.user = this.localStorageService.getUser();


    //When the user is logged in his image will be emitted to this parent
    //This subspciption will received the emitted image
    this.sendImage = this.localStorageService.sendImage$.subscribe(result => {
      this.image = result;
    })

    //Get the image if the user refreshes the page
    this.image = this.localStorageService.getImage();

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
    localStorage.removeItem('pollID');
    this.router.navigate(['/login']);
  }

  //Unsubscribe all the subscriptions to avoid data leaks
  ngOnDestroy() {
    this.sendFriends.unsubscribe();
    this.sendUser.unsubscribe();
    this.sendImage.unsubscribe();
  }
}