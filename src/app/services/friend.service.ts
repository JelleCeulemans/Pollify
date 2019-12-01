import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';
import { Friend } from '../models/friend.model';



@Injectable({
    providedIn: 'root'
})
//Includes all the calls to the Friend table of the database
export class FriendService {
    //declarations
    private emitFriends = new Subject<number>();
    sendFriends$ = this.emitFriends.asObservable();
    amount: number;
    baseURL = environment.baseURL;

    //Make all the necessary services available
    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService) {
    }

    //Update the parent (app) that there are some friend request
    //After this the number of friend requests are visible in the navbar.
    emitChangeFriends(change: number) {
        this.amount = change;
        this.emitFriends.next(change);
    }

    //Retrieve all friend objects who has invited the logged in person.
    getReceivedInvitations(): Observable<Friend[]> {
        return this.http.get<Friend[]>(this.baseURL + "/Friend/receivedInvitations?userid=" + this.localStorageService.getUser().userID);
    }

    //Insert a new Friend object into the database
    insertFriend(friend: Friend): Observable<Friend> {
        return this.http.post<Friend>(this.baseURL + "/Friend", friend);
    }

    //Decline a friend request
    //navbar will alse be updated
    removeFriend(friendID: number): Observable<Friend> {
        this.emitChangeFriends(this.amount--);
        return this.http.delete<Friend>(this.baseURL + "/Friend/" + friendID);
    }

    //Accept a friend request
    updateFriend(friendID: number) {
        return this.http.put<Friend>(this.baseURL + "/Friend", new Friend(friendID, null, null, true));
    }

    //Remove a friend by a given user id
    deleteFriend(userID: number) {
        return this.http.delete<Friend>(this.baseURL + "/Friend/byIds?senderid=" + userID + "&receiverid=" + this.localStorageService.getUser().userID);
    }
}