import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll/poll.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  countPolls$: Observable<number>;
  countUsers$: Observable<number>;

  constructor(private pollService: PollService) { }

  //Is executed on the initializing of the home component
  //This method will retrieve the total amount of polls and activated users
  ngOnInit() {
    this.countPolls$ = this.pollService.getCountPolls();
    this.countUsers$ = this.pollService.getCountUsers();
  }
}
