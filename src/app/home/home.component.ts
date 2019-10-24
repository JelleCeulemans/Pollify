import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
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

  ngOnInit() {
    this.countPolls$ = this.pollService.getCountPolls();
    this.countUsers$ = this.pollService.getCountUsers();
  }

}
