import { Component, OnInit, Input } from '@angular/core';
import { PollService } from 'src/app/poll.service';
import { Poll } from 'src/app/models/poll.model';
import { PollGebruiker } from 'src/app/models/pollgebruiker.model';

@Component({
  selector: 'app-vote-poll',
  templateUrl: './vote-poll.component.html',
  styleUrls: ['./vote-poll.component.scss']
})
export class VotePollComponent implements OnInit {
  poll: Poll;
  
  constructor(private pollService: PollService) { }

  ngOnInit() {
    this.poll = this.pollService.getPoll();

    console.log(this.poll);
  }
}
