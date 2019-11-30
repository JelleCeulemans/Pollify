import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

//This server collect all the actions to the localStorage
export class LocalStorageService {
  baseURL = environment.baseURL;
  private emitImage = new Subject<string>();
  sendImage$ = this.emitImage.asObservable();

  private emitUser = new Subject<User>();
    sendUser$ = this.emitUser.asObservable();

  constructor() {
  }

  //Add the user to object to the brower's localStorage into string format.
  //And user is emitted
  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.emitUser.next(user);
  }

  //Retrieve and format the user object that is stored as string in the browser's localStorage.
  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  //Add the pollID  to the brower's localStorage into string format.
  setPollID(pollID: number) {
    localStorage.setItem('pollID', pollID.toString());
  }

  //Get the poll ID from the localStorage and parse it to a number.
  getPollID(): number {
    return +localStorage.getItem('pollID');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setImage(imageUrl: string) {
    localStorage.setItem('image', imageUrl);
    this.emitImage.next(imageUrl);
  }

  getImage() {
    return localStorage.getItem('image');
  }
}