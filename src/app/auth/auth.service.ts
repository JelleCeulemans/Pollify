import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Friend } from '../models/friend.model';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  private emitFriends = new Subject<number>();
  private emitUser = new Subject<User>();
  sendFriends$ = this.emitFriends.asObservable();
  sendUser$ = this.emitUser.asObservable();
  amount: number;
  baseURL = environment.baseURL;

  constructor(private http: HttpClient) { }

  emitChangeFriends(change: number) {
    this.amount = change;
    this.emitFriends.next(change);
  }

  emitChangeUser(user: User) {
    this.emitUser.next(user);
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

  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/Friend/byId?userid=" + this.getUser().userID);
  }

  getUserByEmail(email: string) {
    return this.http.get<User>(this.baseURL + "/User/byEmail?email=" + email);
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
    this.emitChangeFriends(this.amount--);
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
