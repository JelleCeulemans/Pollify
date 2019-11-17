import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll/poll.service';
import { Router, } from '@angular/router';
import { Poll } from '../models/poll.model';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { Friend } from '../models/friend.model';
import { PollUser } from '../models/poll-user.model';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { TwoOptionsDialogComponent } from '../dialog/two-options-dialog/two-options-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pollUsers$: Observable<PollUser[]>;
  user: User;
  receivedInvitations: Friend[];
  friends: number;
  pollInvites$: Observable<PollUser[]>;

  constructor(
    private pollService: PollService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.initializePolls();
    this.authService.getReceivedInvitations().subscribe(result => {
      this.receivedInvitations = result;
      this.authService.emitChange(result.length);
    });
    this.authService.getFriends().subscribe(result => {
      this.friends = result.length;
    });
    this.pollInvites$ = this.pollService.getPollInvites();
  }

  initializePolls() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.pollUsers$ = this.pollService.getPollUsers(this.user.userID);
    }
  }

  vote(poll: Poll) {
    this.pollService.setPollID(poll.pollID);
    this.router.navigate(['/votePoll']);
  }

  createPoll() {
    this.router.navigate(['/createPoll']);
  }

  deletePoll(poll: Poll) {
    const twoOptionsDialog = this.dialog.open(TwoOptionsDialogComponent, {
      data: {
        title: "Reset Password",
        content: "<p>Do you want to delete this poll?</p><p>Title: <b>" + poll.name + "</b></p>",
        button1: "Yes",
        button2: "No"
      }
    });

    twoOptionsDialog.afterClosed().subscribe(result => {
      if (result) {
        this.pollService.deletePoll(poll.pollID).subscribe(result => {
          this.initializePolls();
        });
      }
    });
  }

  acceptPollInvite(pollUser: PollUser) {
    this.pollService.acceptPollInvite(pollUser).subscribe(result => {
      console.log(result);
      this.ngOnInit();
    })
  }

  deletePollInvite(pollUser: PollUser) {
    this.pollService.deletePollUser(pollUser).subscribe(result => {
      this.ngOnInit();
    });
  }
}
