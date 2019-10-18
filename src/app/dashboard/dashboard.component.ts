import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { PollGebruiker } from '../models/pollgebruiker.model';
import { Router } from '@angular/router';
import { Poll } from '../models/poll.model';
import { Gebruiker } from '../models/gebruiker.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit { 
  pollGebruikers: PollGebruiker[];
  gebruiker: Gebruiker;
  
  constructor(
    private pollService: PollService, 
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.gebruiker = this.authService.getGebruiker();
    if (this.gebruiker) {
      this.pollService.getPollGebruikers(this.gebruiker.gebruikerID).subscribe(result => {
        this.pollGebruikers = result;
      })
    }
  }

  vote(poll: Poll) {
    this.pollService.setPoll(poll);
    this.router.navigate(['/votePoll']);
  }

  createPoll() {
    this.router.navigate(['/createPoll']);
  }

}
