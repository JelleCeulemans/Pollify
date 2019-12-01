import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';
import { User } from '../models/user.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

//Includes all the calls to the User table of the database
export class UserService {
    //declarations
    baseURL = environment.baseURL;

    //Making all the necessary services available
    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService) {
    }

    //Get the total amount of verified users
    getCountUsers() {
        return this.http.get<number>(this.baseURL + "/User/countUsers");
    }

    //Activate a user account
    activateUser(user: User) {
        return this.http.put<User>(this.baseURL + "/User/activate", user);
    }

    //Update a user
    //This is used when someone sended a friend request to a person that wasn't registered.
    updateUser(user: User) {
        return this.http.put<User>(this.baseURL + "/User/updateUser", user);
    }

    //Get a user object by a given guid
    getUserWhereGuid(guid: string) {
        return this.http.get<User>(this.baseURL + "/User/whereGuid?guid=" + guid);
    }

    //Update the password for a given user
    updatePassword(user: User) {
        return this.http.put<User>(this.baseURL + "/User/updatePassword", user);
    }

    

    //Is used on the login screen to authenticate the user with his username and password.
    //After this call the user has a recieved a token.
    authenticate(user: User): Observable<User> {
        return this.http.post<User>(this.baseURL + "/User/authenticate", user);
    }

    //Is used to authenticate a user who logged in via the Facebook option with only the email of his facebook account.
    //After this call the user has a recieved a token.
    fbauth(user: User): Observable<User> {
        return this.http.post<User>(this.baseURL + "/User/fbauth", user);
    }

    //Used to insert a new user in the database
    insertUser(user: User) {
        return this.http.post<User>(this.baseURL + "/User", user);
    }

    //Retreive all friends from the database for a specific user.
    getFriends(): Observable<User[]> {
        return this.http.get<User[]>(this.baseURL + "/User/byId?userid=" + this.localStorageService.getUser().userID);
    }

    //Retrieve a user object with a given e-mail adress
    getUserByEmail(email: string) {
        return this.http.get<User>(this.baseURL + "/User/byEmail?email=" + email);
    }

    //Retrieve all user objects where the logged in person an invitation has send to.
    getSendedInvitations(): Observable<User[]> {
        return this.http.get<User[]>(this.baseURL + "/Friend/sendedInvitations?userid=" + this.localStorageService.getUser().userID);
    }
}