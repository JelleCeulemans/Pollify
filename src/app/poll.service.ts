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

   getPollGebruikers(PollGebruikerID: number): Observable<PollGebruiker[]> {
    return this.http.get<PollGebruiker[]>("https://localhost:44389/api/PollGebruiker/" + PollGebruikerID);
  }

  createPoll(poll: Poll) {
    return this.http.post<Poll>("https://localhost:44389/api/poll", poll);
  }

  createPollGebruiker(gebruikerID: number, pollID) {

    this.http.get<Poll>("https://localhost:44389/api/poll/" + pollID).subscribe(result => {
      this.poll = result;
      console.log(result);
      console.log("1");
    });

    this.http.get<Gebruiker>("https://localhost:44389/api/gebruiker/" + gebruikerID).subscribe(result => {
      this.gebruiker = result;
      console.log(result);
      console.log("2");
    });

    this.pollGebruiker = new PollGebruiker(0, this.poll, this.gebruiker);
    console.log(this.pollGebruiker);
    console.log("3");
      
    return this.http.post<PollGebruiker>("https://localhost:44389/api/pollgebruiker/", this.pollGebruiker);
  }

  setPoll(poll: Poll) {
    this.poll = poll;
  }

  getPoll() {
    return this.poll;
  }


}
