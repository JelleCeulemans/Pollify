import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PollService } from 'src/app/poll.service';
import { Poll } from 'src/app/models/poll.model';
import { Antwoord } from 'src/app/models/antwoord.model';
import { Stem } from 'src/app/models/stem.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { Gebruiker } from 'src/app/models/gebruiker.model';

@Component({
  selector: 'app-vote-poll',
  templateUrl: './vote-poll.component.html',
  styleUrls: ['./vote-poll.component.scss']
})
export class VotePollComponent implements OnInit, OnDestroy {
  poll: Poll;
  antwoordenIDPoll: number[];
  antwoordenIDGebruiker: number[];
  participants$: Observable<Gebruiker[]>;
  gebruikerID: number;

  constructor(private pollService: PollService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.poll = this.pollService.getPoll();
    this.antwoordenIDPoll = new Array<number>();
    this.antwoordenIDGebruiker = new Array<number>();
    this.pollService.getAntwoorden(this.authService.getGebruiker().gebruikerID, this.poll.pollID).subscribe(result => {
      result.forEach(element => {
        this.antwoordenIDGebruiker.push(element.antwoordID);
        this.antwoordenIDPoll.push(element.antwoordID);
      });
    });
    this.gebruikerID = this.authService.getGebruiker().gebruikerID;
    this.participants$ = this.pollService.getPollParticipants();
    this.pollService.getPollParticipants().subscribe(result => {
      console.log(result);
    });
  }

  updateVote(event, answer) {
    if (event.checked) {
      this.antwoordenIDPoll.push(answer);
    } else {
      var index = this.antwoordenIDPoll.indexOf(answer);
      if (index > -1) {
        this.antwoordenIDPoll.splice(index, 1);
      }
    }
  }

  saveVote() {
    this.poll.antwoorden.forEach(element => {
      if (this.antwoordenIDPoll.includes(element.antwoordID) && !this.antwoordenIDGebruiker.includes(element.antwoordID)) {
         this.pollService.createStem(new Stem(0, element, this.authService.getGebruiker())).subscribe();
      } else if (!this.antwoordenIDPoll.includes(element.antwoordID) && this.antwoordenIDGebruiker.includes(element.antwoordID)) {
        this.pollService.deleteStem(element.antwoordID, this.authService.getGebruiker().gebruikerID).subscribe();
      }
    });
    this.router.navigate(["/dashboard"]);
  }

  ngOnDestroy() {
    this.antwoordenIDPoll = new Array<number>();
  }
}
