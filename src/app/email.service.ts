import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  //the baseURL is placed into the environments variables,
  //because now this url will automatically change when it's a production or a test version
  baseURL = environment.baseURL;


  constructor(private http: HttpClient) { }

  forgotPassword(user: User): Observable<User> {
    return this.http.post<User>(this.baseURL + '/Email/forgotPassword', user);
  }

  activationLink(user: User) {
    return this.http.post<User>(this.baseURL + '/Email/activationLink', user);
  }

}
