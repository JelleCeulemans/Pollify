import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  baseURL = 'https://localhost:44389/api/Email';
  //baseURL = 'https://pollifybackend.azurewebsites.net/api';

  constructor(private http: HttpClient) { }

  forgotPassword(user: User): Observable<User> {
    return this.http.post<User>(this.baseURL + '/forgotPassword', user);
  }
}
