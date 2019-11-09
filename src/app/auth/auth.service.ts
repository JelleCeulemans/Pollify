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
  receivedFriends: Friend[];
  private emitChargeSource = new Subject<number>();
  changeEmitted$ = this.emitChargeSource.asObservable();
  amount: number;

  constructor(private http: HttpClient) { }

   emitChange(change: number) {
     this.amount = change;
     this.emitChargeSource.next(change);
   }

   authenticate(user: User): Observable<User> {
    return this.http.post<User>("https://localhost:44389/api/User/authenticate", user);
  }

   getUsers(): Observable<User[]> {
    return this.http.get<User[]>("https://localhost:44389/api/User");
  }

  insertUser(user: User) {
    return this.http.post<User>("https://localhost:44389/api/User", user);
  }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>("https://localhost:44389/api/Friend/byId?userid=" + this.user.userID);
  }

  getUserByEmail(email: string) {
    return this.http.get<User>("https://localhost:44389/api/User/byEmail?email=" + email);
  }

  getSendedInvitations(): Observable<string[]> {
    return this.http.get<string[]>("https://localhost:44389/api/Friend/sendedInvitations?gebruikerid=" + this.user.userID);
  }

  insertFriend(friend: Friend): Observable<Friend> {
    return this.http.post<Friend>("https://localhost:44389/api/Friend", friend);
  }

  getReceivedInvitations(): Observable<Friend[]> {
    return this.http.get<Friend[]>("https://localhost:44389/api/Friend/receivedInvitations?gebruikerid=" + this.user.userID);
  }

  setReceivedFriends(receivedFriends: Friend[]) {
    this.receivedFriends = receivedFriends;
  }

  getReceivedFriends(){
    return this.receivedFriends;
  }

  removeFriend(friendID: number): Observable<Friend> {
    this.emitChange(this.amount--);
    return this.http.delete<Friend>("https://localhost:44389/api/Friend/" + friendID);
  }

  updateFriend(friendID: number) {
    return this.http.put<Friend>("https://localhost:44389/api/Friend", new Friend(friendID, null, null, true));
  }

  activateUser(user: User) {
    return this.http.put<User>("https://localhost:44389/api/User/activate", user);
  }

  updateUser(user: User) {
    return this.http.put<User>("https://localhost:44389/api/User/updateUser", user);
  }

  getUserWhereGuid(guid: string) {
    return this.http.get<User>("https://localhost:44389/api/User/whereGuid?guid=" + guid);
  }

  updatePassword(user: User) {
    return this.http.put<User>("https://localhost:44389/api/User/updatePassword", user);
  }
}
