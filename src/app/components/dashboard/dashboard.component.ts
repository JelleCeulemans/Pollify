import { Component, OnInit, OnDestroy } from '@angular/core';
import { PollService } from '../../services/poll.service';
import { Router, } from '@angular/router';
import { Poll } from '../../models/poll.model';
import { MatDialog } from '@angular/material';
import { Friend } from '../../models/friend.model';
import { PollUser } from '../../models/poll-user.model';
import { User } from '../../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { TwoOptionsDialogComponent } from '../../dialogs/two-options-dialog/two-options-dialog.component';
import { LocalStorageService } from '../../services/localStorage.service';
import { PollUserService } from '../../services/pollUser.service';
import { FriendService } from '../../services/friend.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  //Declarations
  polls$: Observable<Poll[]>;
  user: User;
  receivedInvitations: Friend[];
  friends: number;
  pollInvites$: Observable<PollUser[]>;

  //Subscriptions
  private receivedInvites: Subscription;
  private getFriends: Subscription;

  //Make all the necessary services available
  constructor(
    private pollService: PollService,
    private router: Router,
    private pollUserService: PollUserService,
    private friendService: FriendService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.initializePolls();
    this.receivedInvites = this.friendService.getReceivedInvitations().subscribe(result => {
      this.receivedInvitations = result;
      this.friendService.emitChangeFriends(result.length);
    });
    this.getFriends = this.userService.getFriends().subscribe(result => {
      this.friends = result.length;
    });
    this.pollInvites$ = this.pollUserService.getPollInvites();
  }

  initializePolls() {
    this.user = this.localStorageService.getUser();
    if (this.user) {
      this.polls$ = this.pollService.getPollsPerUser(this.user.userID);
    }
  }

  vote(poll: Poll) {
    this.localStorageService.setPollID(poll.pollID);
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
    this.pollUserService.acceptPollInvite(pollUser).subscribe(result => {
      console.log(result);
      this.ngOnInit();
    })
  }

  deletePollInvite(pollUser: PollUser) {
    this.pollUserService.deletePollUser(pollUser).subscribe(result => {
      this.ngOnInit();
    });
  }

  ngOnDestroy() {
    this.receivedInvites.unsubscribe();
    this.getFriends.unsubscribe();
  }
}
