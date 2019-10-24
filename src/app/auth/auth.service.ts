import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gebruiker } from '../models/gebruiker.model';
import { Friend } from '../models/friend.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  gebruiker: Gebruiker;
  receivedFriends: Friend[];

  constructor(private http: HttpClient) {
    
   }

   authenticate(gebruiker: Gebruiker): Observable<Gebruiker> {
    return this.http.post<Gebruiker>("https://localhost:44389/api/Gebruiker/authenticate", gebruiker);
  }

   getGebruikers(): Observable<Gebruiker[]> {
    return this.http.get<Gebruiker[]>("https://localhost:44389/api/Gebruiker");
  }

  insertGebruiker(gebruiker: Gebruiker) {
    return this.http.post<Gebruiker>("https://localhost:44389/api/Gebruiker", gebruiker);
  }

  setGebruiker(gebruiker: Gebruiker) {
    this.gebruiker = gebruiker;
  }

  getGebruiker() {
    return this.gebruiker;
  }

  getFriends(): Observable<Gebruiker[]> {
    return this.http.get<Gebruiker[]>("https://localhost:44389/api/Friend/byId?gebruikerid=" + this.gebruiker.gebruikerID);
  }

  getGebruikerByEmail(email: string) {
    return this.http.get<Gebruiker>("https://localhost:44389/api/Gebruiker/byEmail?email=" + email);
  }

  getSendedInvitations(): Observable<string[]> {
    return this.http.get<string[]>("https://localhost:44389/api/Friend/sendedInvitations?gebruikerid=" + this.gebruiker.gebruikerID);
  }

  insertFriend(friend: Friend): Observable<Friend> {
    return this.http.post<Friend>("https://localhost:44389/api/Friend", friend)
  }

  getReceivedInvitations(): Observable<Friend[]> {
    return this.http.get<Friend[]>("https://localhost:44389/api/Friend/receivedInvitations?gebruikerid=" + this.gebruiker.gebruikerID);
  }

  setReceivedFriends(receivedFriends: Friend[]) {
    this.receivedFriends = receivedFriends;
  }

  getReceivedFriends(){
    return this.receivedFriends;
  }
}
