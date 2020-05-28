import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Poll } from '../models/poll.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
//Includes all the calls to the Poll table of the database
export class PollService {
  //declaration
  baseURL = environment.baseURL;


  //Make all the necessary services available
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService) {
  }

  //Get a poll by a given id
  getPollById() {
    return this.http.get<Poll>(this.baseURL + "/Poll/" + this.localStorageService.getPollID());
  }

  //Create a new poll in the database
  createPoll(poll: Poll) {
    return this.http.post<Poll>(this.baseURL + "/Poll", poll);
  }

  //Remove a poll from the database
  deletePoll(pollID: number) {
    return this.http.delete<Poll>(this.baseURL + "/Poll/" + pollID);
  }

  //Get all the participants for a certain poll
  getPollParticipants(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/User/participants?pollid=" + this.localStorageService.getPollID());
  }

  //Get all the friends that are not participanting to the poll
  getPollNoParticipants(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/User/noparticipants?userid=" + this.localStorageService.getUser().userID + "&pollid=" + this.localStorageService.getPollID());
  }

  //Get the total number of polls
  getCountPolls(): Observable<number> {
    return this.http.get<number>(this.baseURL + "/Poll/countPolls");
  }

  //Get all  the polls from the logged in person
  getPollsPerUser(userID: number): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.baseURL + "/Poll/perUser?userid=" + userID);
  }
}