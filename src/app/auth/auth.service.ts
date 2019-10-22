import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gebruiker } from '../models/gebruiker.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  gebruiker: Gebruiker;

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

  getFriends(gebruiker: Gebruiker) {
    return this.http.get<Gebruiker[]>("https://localhost:44389/api/Vriend/byId?gebruikerid=" + gebruiker.gebruikerID);
  }

  getGebruikerByEmail(email: string) {
    return this.http.get<Gebruiker>("https://localhost:44389/api/Gebruiker/byEmail?email=" + email);
  }
}
