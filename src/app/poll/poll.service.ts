import { Injectable } from '@angular/core';
import { PollUser } from '../models/poll-user.model';
import { Vote } from '../models/vote.model';
import { User } from '../models/user.model';
import { Poll } from '../models/poll.model';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class PollService {
  pollID: number;
  user: User;
  pollUser: PollUser;
  vote: Vote;
  baseURL = 'https://localhost:44389/api';
  //baseURL = 'https://pollifybackend.azurewebsites.net/api';


  constructor(private http: HttpClient, private authService: AuthService) {

  }

  getPollbyId() {
    return this.http.get<Poll>(this.baseURL + "/Poll/" + this.pollID);
  }

  getPollUsers(userID: number): Observable<PollUser[]> {
    return this.http.get<PollUser[]>(this.baseURL + "/PollUser/perUser?userid=" + userID);
  }

  createPoll(poll: Poll) {
    console.log('create poll');
    return this.http.post<Poll>(this.baseURL + "/Poll", poll);
  }

  deletePoll(pollID: number) {
    
    return this.http.delete<Poll>(this.baseURL + "/Poll/" + pollID);
  }

  createPollUser(pollUser: PollUser) {
    console.log('create pollUser');
    return this.http.post<PollUser>(this.baseURL + "/PollUser", pollUser);
  }

  getAnswers(userID: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.baseURL + "/Answer/specific?userid=" + userID + "&pollID=" + this.pollID);
  }

  createVote(vote: Vote) {
    return this.http.post<Vote>(this.baseURL + "/Vote", vote);
  }

  deleteVote(answerID: number, userID: number) {
    return this.http.delete<Vote>(this.baseURL + "/Vote?answerid=" + answerID + "&userid=" + userID);
  }

  getPollParticipants(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/User/participants?pollid=" + this.pollID);
  }

  getPollNoParticipants(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + "/User/noparticipants?userid=" + this.authService.getUser().userID + "&pollid=" + this.pollID);
  }

  setPollID(pollID: number) {
    this.pollID = pollID;
  }

  getPollID() {
    return this.pollID;
  }

  getCountPolls(): Observable<number> {
    return this.http.get<number>(this.baseURL + "/Poll/countPolls");
  }

  getCountUsers(): Observable<number> {
    return this.http.get<number>(this.baseURL + "/User/countUsers");
  }

  getPollInvites(): Observable<PollUser[]> {
    return this.http.get<PollUser[]>(this.baseURL + "/PollUser/pollInvites?userid=" + this.authService.getUser().userID);
  }

  deletePollUser(pollUser: PollUser) {
    return this.http.delete<PollUser>(this.baseURL + "/PollUser/" + pollUser.pollUserID);
  }

  acceptPollInvite(pollUser: PollUser) {
    return this.http.put<PollUser>(this.baseURL + "/PollUser/", pollUser);
  }

  addAnswer(answer: Answer) {
    return this.http.post<Answer>(this.baseURL + "/Answer/", answer);
  }

  delelteAnswer(answer: Answer) {
    return this.http.delete<Answer>(this.baseURL + "/Answer/" + answer.answerID);
  }

  deleteParticipant(userID: number, pollID: number) {
    return this.http.delete<PollUser>(this.baseURL + "/PollUser?userid=" + userID + "&pollid=" + pollID);
  }
}