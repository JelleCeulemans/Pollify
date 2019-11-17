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
  

  constructor(private http: HttpClient, private authService: AuthService) {
    
  }
  //production

  getPollbyId() {
    return this.http.get<Poll>("https://pollifybackend.azurewebsites.net/api/Poll/" + this.pollID);
  }

   getPollUsers(userID: number): Observable<PollUser[]> {
    return this.http.get<PollUser[]>("https://pollifybackend.azurewebsites.net/api/PollUser/perUser?userid=" + userID);
  }

  createPoll(poll: Poll) {
    return this.http.post<Poll>("https://pollifybackend.azurewebsites.net/api/Poll", poll);
  }

  deletePoll(pollID: number) {
    return this.http.delete<Poll>("https://pollifybackend.azurewebsites.net/api/Poll/" + pollID);
  }

  createPollUser(pollUser: PollUser) {
    return this.http.post<PollUser>("https://pollifybackend.azurewebsites.net/api/PollUser", pollUser);
  }

  getAnswers(userID: number): Observable<Answer[]> {
    return this.http.get<Answer[]>("https://pollifybackend.azurewebsites.net/api/Answer/specific?userid=" + userID + "&pollID=" + this.pollID);
  }

  createVote(vote: Vote) {
    return this.http.post<Vote>("https://pollifybackend.azurewebsites.net/api/Vote", vote);
  }

  deleteVote(answerID: number, userID: number) {
    return this.http.delete<Vote>("https://pollifybackend.azurewebsites.net/api/Vote?answerid=" + answerID + "&userid=" + userID);
  }

  getPollParticipants(): Observable<User[]>{
    return this.http.get<User[]>("https://pollifybackend.azurewebsites.net/api/User/participants?pollid=" + this.pollID);
  }

  getPollNoParticipants(): Observable<User[]>{
    return this.http.get<User[]>("https://pollifybackend.azurewebsites.net/api/User/noparticipants?userid=" + this.authService.getUser().userID +"&pollid=" + this.pollID);
  }

  setPollID(pollID: number) {
    this.pollID = pollID;
  }

  getPollID() {
    return this.pollID;
  }

  getCountPolls(): Observable<number> {
    return this.http.get<number>("https://pollifybackend.azurewebsites.net/api/Poll/countPolls");
  }

  getCountUsers(): Observable<number> {
    return this.http.get<number>("https://pollifybackend.azurewebsites.net/api/User/countUsers");
  }

  getPollInvites(): Observable<PollUser[]> {
    return this.http.get<PollUser[]>("https://pollifybackend.azurewebsites.net/api/PollUser/pollInvites?userid=" + this.authService.getUser().userID);
  }

  deletePollUser(pollUser: PollUser) {
    return this.http.delete<PollUser>("https://pollifybackend.azurewebsites.net/api/PollUser/" + pollUser.pollUserID);
  }

  acceptPollInvite(pollUser: PollUser) {
    return this.http.put<PollUser>("https://pollifybackend.azurewebsites.net/api/PollUser/", pollUser);
  }

  addAnswer(answer: Answer) {
    return this.http.post<Answer>("https://pollifybackend.azurewebsites.net/api/Answer/", answer);
  }

  delelteAnswer(answer: Answer) {
    return this.http.delete<Answer>("https://pollifybackend.azurewebsites.net/api/Answer/" + answer.answerID);
  }


  //testing
  // getPollbyId() {
  //   return this.http.get<Poll>("https://localhost:44389/api/Poll/" + this.pollID);
  // }

  //  getPollUsers(userID: number): Observable<PollUser[]> {
  //   return this.http.get<PollUser[]>("https://localhost:44389/api/PollUser/perUser?userid=" + userID);
  // }

  // createPoll(poll: Poll) {
  //   return this.http.post<Poll>("https://localhost:44389/api/Poll", poll);
  // }

  // deletePoll(pollID: number) {
  //   return this.http.delete<Poll>("https://localhost:44389/api/Poll/" + pollID);
  // }

  // createPollUser(pollUser: PollUser) {
  //   return this.http.post<PollUser>("https://localhost:44389/api/PollUser", pollUser);
  // }

  // getAnswers(userID: number): Observable<Answer[]> {
  //   return this.http.get<Answer[]>("https://localhost:44389/api/Answer/specific?userid=" + userID + "&pollID=" + this.pollID);
  // }

  // createVote(vote: Vote) {
  //   return this.http.post<Vote>("https://localhost:44389/api/Vote", vote);
  // }

  // deleteVote(answerID: number, userID: number) {
  //   return this.http.delete<Vote>("https://localhost:44389/api/Vote?answerid=" + answerID + "&userid=" + userID);
  // }

  // getPollParticipants(): Observable<User[]>{
  //   return this.http.get<User[]>("https://localhost:44389/api/User/participants?pollid=" + this.pollID);
  // }

  // getPollNoParticipants(): Observable<User[]>{
  //   return this.http.get<User[]>("https://localhost:44389/api/User/noparticipants?userid=" + this.authService.getUser().userID +"&pollid=" + this.pollID);
  // }

  // setPollID(pollID: number) {
  //   this.pollID = pollID;
  // }

  // getPollID() {
  //   return this.pollID;
  // }

  // getCountPolls(): Observable<number> {
  //   return this.http.get<number>("https://localhost:44389/api/Poll/countPolls");
  // }

  // getCountUsers(): Observable<number> {
  //   return this.http.get<number>("https://localhost:44389/api/User/countUsers");
  // }

  // getPollInvites(): Observable<PollUser[]> {
  //   return this.http.get<PollUser[]>("https://localhost:44389/api/PollUser/pollInvites?userid=" + this.authService.getUser().userID);
  // }

  // deletePollUser(pollUser: PollUser) {
  //   return this.http.delete<PollUser>("https://localhost:44389/api/PollUser/" + pollUser.pollUserID);
  // }

  // acceptPollInvite(pollUser: PollUser) {
  //   return this.http.put<PollUser>("https://localhost:44389/api/PollUser/", pollUser);
  // }

  // addAnswer(answer: Answer) {
  //   return this.http.post<Answer>("https://localhost:44389/api/Answer/", answer);
  // }

  // delelteAnswer(answer: Answer) {
  //   return this.http.delete<Answer>("https://localhost:44389/api/Answer/" + answer.answerID);
  // }
}