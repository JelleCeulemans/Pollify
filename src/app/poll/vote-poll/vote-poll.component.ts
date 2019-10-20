import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PollService } from 'src/app/poll.service';
import { Poll } from 'src/app/models/poll.model';
import { Antwoord } from 'src/app/models/antwoord.model';
import { Stem } from 'src/app/models/stem.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote-poll',
  templateUrl: './vote-poll.component.html',
  styleUrls: ['./vote-poll.component.scss']
})
export class VotePollComponent implements OnInit, OnDestroy {
  poll: Poll;
  antwoordenPoll: Antwoord[];
  antwoordenGebruiker: Antwoord[];
  antwoordenLijst: string[];

  constructor(private pollService: PollService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.antwoordenLijst = new Array<string>();
    this.poll = this.pollService.getPoll();
    this.pollService.getAntwoorden(this.authService.getGebruiker().gebruikerID, this.poll.pollID).subscribe(result => {
      this.antwoordenGebruiker = result;
      result.forEach(element => {
        this.antwoordenLijst.push(element.beantwoording);
      })

      console.log(this.poll.antwoorden);
    });
    this.antwoordenPoll = new Array<Antwoord>();
  }

  updateVote(event, answer) {
    if (event.checked) {
      this.antwoordenPoll.push(answer);
    } else {
      var index = this.antwoordenPoll.indexOf(answer);
      if (index > -1) {
        this.antwoordenPoll.splice(index, 1);
      }
    }
  }

  saveVote() {
    this.poll.antwoorden.forEach(element => {
      if (this.antwoordenPoll.includes(element) && !this.antwoordenGebruiker.includes(element)) {
         this.pollService.createStem(new Stem(0, element, this.authService.getGebruiker())).subscribe(result =>  {
           console.log(result);
         });
      }
      
      if (!this.antwoordenPoll.includes(element) && this.antwoordenGebruiker.includes(element)) {
        this.pollService.deleteStem(element.antwoordID, this.authService.getGebruiker().gebruikerID);
      }
    });
    this.router.navigate(["/dashboard"]);
  }

  ngOnDestroy() {
    this.antwoordenPoll = new Array<Antwoord>();
  }


}
