import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';
import { PollUser } from '../models/poll-user.model';



@Injectable({
  providedIn: 'root'
})

//Includes all the calls to the PollUser table of the database
export class PollUserService {
  //declaration
  baseURL = environment.baseURL;

  //Make all the necessary services available
  constructor(
      private http: HttpClient,
      private localStorageService: LocalStorageService) {
  }

  //Retrieve all the poll invites of the logged in person
  getPollInvites(): Observable<PollUser[]> {
    return this.http.get<PollUser[]>(this.baseURL + "/PollUser/pollInvites?userid=" + this.localStorageService.getUser().userID);
  }

  //Remove a user from a poll
  deletePollUser(pollUser: PollUser) {
    return this.http.delete<PollUser>(this.baseURL + "/PollUser/" + pollUser.pollUserID);
  }

  //Accept a poll invitation
  acceptPollInvite(pollUser: PollUser) {
    return this.http.put<PollUser>(this.baseURL + "/PollUser/", pollUser);
  }

  //Remove a poll participant
  deleteParticipant(userID: number, pollID: number) {
    return this.http.delete<PollUser>(this.baseURL + "/PollUser?userid=" + userID + "&pollid=" + pollID);
  }

  //Add a user to a poll
  createPollUser(pollUser: PollUser) {
    return this.http.post<PollUser>(this.baseURL + "/PollUser", pollUser);
  }
}