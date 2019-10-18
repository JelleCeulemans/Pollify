import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { PollGebruiker } from '../models/pollgebruiker.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pollGebruikers: PollGebruiker[];
  
  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit() {
    this.pollService.getPollGebruikers(1).subscribe(result => {
      console.log(result);
      this.pollGebruikers = result;
    })
  }

  createPoll() {
    this.router.navigate(['/createPoll']);
  }

}
