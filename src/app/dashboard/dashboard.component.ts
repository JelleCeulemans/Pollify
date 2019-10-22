import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { PollGebruiker } from '../models/pollgebruiker.model';
import { Router, NavigationEnd } from '@angular/router';
import { Poll } from '../models/poll.model';
import { Gebruiker } from '../models/gebruiker.model';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { DeletePollComponent } from '../dialog/delete-poll/delete-poll.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pollGebruikers: PollGebruiker[];
  gebruiker: Gebruiker;
  vrienden$: Observable<Gebruiker[]>;

  constructor(
    private pollService: PollService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) { 
        this.initializePolls();
       }
    });
  }

  ngOnInit() {
    this.pollGebruikers = new Array<PollGebruiker>();
    this.initializePolls();

    this.vrienden$ = this.authService.getFriends(this.authService.getGebruiker());
  }

  initializePolls() {
    this.gebruiker = this.authService.getGebruiker();
    if (this.gebruiker) {
      this.pollService.getPollGebruikers(this.gebruiker.gebruikerID).subscribe(result => {
        this.pollGebruikers = result;
      });
    }
  }

  vote(poll: Poll) {
    this.pollService.setPoll(poll);
    this.router.navigate(['/votePoll']);
  }

  createPoll() {
    this.router.navigate(['/createPoll']);
  }

  deletePoll(poll: Poll) {
    const deletePollDialog = this.dialog.open(DeletePollComponent, {
      data: {
        title: poll.naam
      }
    });


    deletePollDialog.afterClosed().subscribe(result => {
      if (result) {
        this.pollService.deletePoll(poll.pollID).subscribe(result => {
          console.log(result);
          this.initializePolls();
        });
      } else {
        console.log("don't delete dialog");
      }
    })
  }

}
