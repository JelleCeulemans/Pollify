import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { PollGebruiker } from './models/pollgebruiker.model';
import { Poll } from './models/poll.model';
import { Gebruiker } from './models/gebruiker.model';
import { Antwoord } from './models/antwoord.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  poll: Poll;
  gebruiker: Gebruiker;
  pollGebruiker: PollGebruiker;

  constructor(private http: HttpClient) {
    
   }

   getPollGebruikers(gebruikerID: number): Observable<PollGebruiker[]> {
    return this.http.get<PollGebruiker[]>("https://localhost:44389/api/Pollgebruiker/perUser?gebruikerid=" + gebruikerID);
  }

  createPoll(poll: Poll) {
    return this.http.post<Poll>("https://localhost:44389/api/poll", poll);
  }

  createPollGebruiker(pollGebruiker: PollGebruiker) {
    console.log(pollGebruiker);
    return this.http.post<PollGebruiker>("https://localhost:44389/api/pollGebruiker", pollGebruiker)
  }

  setPoll(poll: Poll) {
    this.poll = poll;
  }

  getPoll() {
    return this.poll;
  }


}
