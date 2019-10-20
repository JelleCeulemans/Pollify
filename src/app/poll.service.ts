import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { PollGebruiker } from './models/pollgebruiker.model';
import { Poll } from './models/poll.model';
import { Gebruiker } from './models/gebruiker.model';
import { Antwoord } from './models/antwoord.model';
import { Stem } from './models/stem.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  poll: Poll;
  gebruiker: Gebruiker;
  pollGebruiker: PollGebruiker;
  stem: Stem;

  constructor(private http: HttpClient) {
    
   }

   getPollGebruikers(gebruikerID: number): Observable<PollGebruiker[]> {
    return this.http.get<PollGebruiker[]>("https://localhost:44389/api/Pollgebruiker/perUser?gebruikerid=" + gebruikerID);
  }

  createPoll(poll: Poll) {
    return this.http.post<Poll>("https://localhost:44389/api/Poll", poll);
  }

  deletePoll(pollID: number) {
    return this.http.delete<Poll>("https://localhost:44389/api/Poll/" + pollID);
  }

  createPollGebruiker(pollGebruiker: PollGebruiker) {
    return this.http.post<PollGebruiker>("https://localhost:44389/api/pollGebruiker", pollGebruiker);
  }

  getAntwoorden(gebruikerid: number, pollid: number): Observable<Antwoord[]> {
    return this.http.get<Antwoord[]>("https://localhost:44389/api/Antwoord/specific?gebruikerid=" + gebruikerid + "&pollID=" + pollid);
  }

  createStem(stem: Stem) {
    return this.http.post<Stem>("https://localhost:44389/api/Stem", stem);
  }

  deleteStem(antwoordID: number, gebruikerID: number) {
    return this.http.delete<Stem>("https://localhost:44389/api/Stem?antwoordid=" + antwoordID + "&gebruikerid=" + gebruikerID);
  }

  setPoll(poll: Poll) {
    this.poll = poll;
  }

  getPoll() {
    return this.poll;
  }


}
