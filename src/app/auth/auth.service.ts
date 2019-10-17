import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gebruiker } from '../models/gebruiker.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
}
