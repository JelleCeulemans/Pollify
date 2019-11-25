import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Friend } from '../models/friend.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  private emitChargeSource = new Subject<number>();
  changeEmitted$ = this.emitChargeSource.asObservable();
  amount: number;
  baseURL = 'https://localhost:44389/api';
  //baseURL = 'https://pollifybackend.azurewebsites.net/api';

  constructor(private http: HttpClient) { }

  emitChange(change: number) {
    this.amount = change;
    this.emitChargeSource.next(change);
  }

  authenticate(user: User): Observable<User> {
    return this.http.post<User>(this.baseURL + "/User/authenticate", user);
  }

  fbauth(user: User): Observable<User> {
    return this.http.post<User>(this.baseURL + "/User/fbauth", user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/User");
  }

  insertUser(user: User) {
    return this.http.post<User>(this.baseURL + "/User", user);
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/Friend/byId?userid=" + this.getUser().userID);
  }

  getUserByEmail(email: string, send: boolean) {
    return this.http.get<User>(this.baseURL + "/User/byEmail?email=" + email + "&send=" + send);
  }

  getSendedInvitations(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/Friend/sendedInvitations?gebruikerid=" + this.getUser().userID);
  }

  insertFriend(friend: Friend): Observable<Friend> {
    return this.http.post<Friend>(this.baseURL + "/Friend", friend);
  }

  getReceivedInvitations(): Observable<Friend[]> {
    return this.http.get<Friend[]>(this.baseURL + "/Friend/receivedInvitations?gebruikerid=" + this.getUser().userID);
  }

  removeFriend(friendID: number): Observable<Friend> {
    this.emitChange(this.amount--);
    return this.http.delete<Friend>(this.baseURL + "/Friend/" + friendID);
  }

  updateFriend(friendID: number) {
    return this.http.put<Friend>(this.baseURL + "/Friend", new Friend(friendID, null, null, true));
  }

  activateUser(user: User) {
    return this.http.put<User>(this.baseURL + "/User/activate", user);
  }

  updateUser(user: User) {
    return this.http.put<User>(this.baseURL + "/User/updateUser", user);
  }

  getUserWhereGuid(guid: string) {
    return this.http.get<User>(this.baseURL + "/User/whereGuid?guid=" + guid);
  }

  updatePassword(user: User) {
    return this.http.put<User>(this.baseURL + "/User/updatePassword", user);
  }

  deleteFriend(userID: number) {
    return this.http.delete<User>(this.baseURL + "/Friend/byIds?senderid=" + userID + "&receiverid=" + this.user.userID);
  }
}
