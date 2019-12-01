import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  //the baseURL is placed into the environments variables,
  //because now this url will automatically change when it's a production or a test version
  baseURL = environment.baseURL;
  user: User;

  //Make all the necessary services available
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService) { }

  //Sending a mail with a link to reset his password
  forgotPassword(user: User): Observable<User> {
    return this.http.post<User>(this.baseURL + '/Email/forgotPassword', user);
  }

  //Sending a mail with an activation link for his account
  activationLink(user: User) {
    return this.http.post<User>(this.baseURL + '/Email/activationLink', user);
  }

  //Sending a mail to inform the user that he's invite for a new poll
  pollInvite(user: User) {
    this.user = this.localStorageService.getUser();
    return this.http.post<User>(this.baseURL + '/Email/pollInvite', user);
  }

  //Sending a mail to inform the user that he has a new friend request
  friendRequest(user: User) {
    user.username = this.localStorageService.getUser().username;
    return this.http.post<User>(this.baseURL + '/Email/friendRequest', user);
  }

  //Sending a mail to invite the user to pollify
  invite(user: User) {
    user.username = this.localStorageService.getUser().username;
    return this.http.post<User>(this.baseURL + '/Email/invite', user);
  }

  //Sending a mail to inform the user he has a new friend
  newFriend(user: User) {
    user.username = this.localStorageService.getUser().username;
    return this.http.post<User>(this.baseURL + '/Email/newFriend', user);
  }
}
