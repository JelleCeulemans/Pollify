import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

//This server collect all the actions to the localStorage
export class LocalStorageService {
  //Declarations
  baseURL = environment.baseURL;
  private emitImage = new Subject<string>();
  sendImage$ = this.emitImage.asObservable();
  private emitUser = new Subject<User>();
  sendUser$ = this.emitUser.asObservable();

  constructor() {
  }

  //Add the user to object to the brower's localStorage into string format
  //And emit it to the parent component
  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.emitUser.next(user);
  }

  //Retrieve and format the user object that is stored as string in the browser's localStorage
  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  //Add the pollID  to the brower's localStorage into string format
  setPollID(pollID: number) {
    localStorage.setItem('pollID', pollID.toString());
  }

  //Get the poll ID from the localStorage and parse it to a number
  getPollID(): number {
    return +localStorage.getItem('pollID');
  }

  //Add the user's authentication token to the browser's localStorage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  //Get the user's authentication token from the localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  //Set the image from Facebook logins to the browser's localStorage
  //And emit that image to the parent component
  setImage(imageUrl: string) {
    localStorage.setItem('image', imageUrl);
    this.emitImage.next(imageUrl);
  }

  //Get the image link from the localStorage
  getImage() {
    return localStorage.getItem('image');
  }
}