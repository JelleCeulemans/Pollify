import { Component, OnInit, OnDestroy } from '@angular/core';
import { PollService } from 'src/app/poll/poll.service';
import { Poll } from 'src/app/models/poll.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Vote } from 'src/app/models/vote.model';
import { PollUser } from 'src/app/models/poll-user.model';
import * as mail from 'src/assets/js/mail.js';

declare var sendPollInvite: any;

@Component({
  selector: 'app-vote-poll',
  templateUrl: './vote-poll.component.html',
  styleUrls: ['./vote-poll.component.scss']
})
export class VotePollComponent implements OnInit, OnDestroy {

  //Add an extra button to add an answer
  poll: Poll;
  answersIDPoll: number[];
  answersIDUser: number[];
  participants$: Observable<User[]>;
  userID: number;
  noparticipants$: Observable<User[]>;
  

  constructor(private pollService: PollService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.pollService.getPollbyId().subscribe(result => {
      this.poll = result;
    });
    this.answersIDPoll = new Array<number>();
    this.answersIDUser = new Array<number>();
    this.pollService.getAnswers(this.authService.getUser().userID).subscribe(result => {
      result.forEach(element => {
        this.answersIDUser.push(element.answerID);
        this.answersIDPoll.push(element.answerID);
      });
    });
    this.userID = this.authService.getUser().userID;
    this.participants$ = this.pollService.getPollParticipants();
    this.noparticipants$ = this.pollService.getPollNoParticipants();
  }

  updateVote(event, answer) {
    if (event.checked) {
      this.answersIDPoll.push(answer);
    } else {
      var index = this.answersIDPoll.indexOf(answer);
      if (index > -1) {
        this.answersIDPoll.splice(index, 1);
      }
    }
  }

  saveVote() {
    this.poll.answers.forEach(element => {
      if (this.answersIDPoll.includes(element.answerID) && !this.answersIDUser.includes(element.answerID)) {
         this.pollService.createVote(new Vote(0, element, this.authService.getUser())).subscribe();
      } else if (!this.answersIDPoll.includes(element.answerID) && this.answersIDUser.includes(element.answerID)) {
        this.pollService.deleteVote(element.answerID, this.authService.getUser().userID).subscribe();
      }
    });
    this.router.navigate(["/dashboard"]);
  }

  inviteFriend(user: User, event: any) {
    if(event.target.tagName == "SPAN") {
      event.target.parentElement.disabled = true;
      event.target.innerHTML = "Invited";
    } else if (event.target.tagName == "BUTTON") {
      event.target.disabled = true;
      event.target.firstChild.innerHTML = "Invited";
    }
    
    this.pollService.createPollUser(new PollUser(0, this.poll, user, false)).subscribe(result => {
      sendPollInvite(result.user.email, this.authService.getUser().username, result.poll.name);
    }); 


  }

  ngOnDestroy() {
    this.answersIDPoll = new Array<number>();
  }
}
