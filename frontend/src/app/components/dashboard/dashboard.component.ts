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
  private dialogSubscription: Subscription;
  private deletePollSub: Subscription;
  private acceptPollInviteSub: Subscription;
  private deletePollUser: Subscription;

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


  //While the component is initializing
  ngOnInit() {
    //Get all the polls from the logged in person
    this.polls$ = this.pollService.getPollsPerUser(this.localStorageService.getUser().userID);
    //Receive all friend requests from the logged in person
    this.receivedInvites = this.friendService.getReceivedInvitations().subscribe(result => {
      this.receivedInvitations = result;
      //Emit this to the parent (app) component
      this.friendService.emitChangeFriends(result.length);
    });
    //Get the amount of friends
    //Not able to create polls without friends
    this.getFriends = this.userService.getFriends().subscribe(result => {
      this.friends = result.length;
    });
    //Get all the poll invites
    this.pollInvites$ = this.pollUserService.getPollInvites();
  }

  //Go to the vote page  to vote on a specific vote
  vote(poll: Poll) {
    this.localStorageService.setPollID(poll.pollID);
    this.router.navigate(['/votePoll']);
  }

  //Go to the create poll page to create a new poll
  createPoll() {
    this.router.navigate(['/createPoll']);
  }

  //Delete a poll
  deletePoll(poll: Poll) {
    //Open a two options dialog to ask if the user is really sure to delete this poll
    const twoOptionsDialog = this.dialog.open(TwoOptionsDialogComponent, {
      data: {
        title: "Reset Password",
        content: "<p>Do you want to delete this poll?</p><p>Title: <b>" + poll.name + "</b></p>",
        button1: "Yes",
        button2: "No"
      }
    });
    //Handle his answer
    //No: don't dete
    //Yes: Delete the poll and reload the component
    this.dialogSubscription = twoOptionsDialog.afterClosed().subscribe(result => {
      if (result) {
        this.deletePollSub = this.pollService.deletePoll(poll.pollID).subscribe(result => {
          this.ngOnInit();
        });
      }
    });
  }

  //Accept a poll invite
  acceptPollInvite(pollUser: PollUser) {
    this.acceptPollInviteSub = this.pollUserService.acceptPollInvite(pollUser).subscribe(result => {
      this.ngOnInit();
    })
  }

  //Decline a poll invite
  deletePollInvite(pollUser: PollUser) {
    this.deletePollUser = this.pollUserService.deletePollUser(pollUser).subscribe(result => {
      console.log(result);
      this.ngOnInit();
    });
  }

  //Unsubscribe all subscriptions to avoid data leaks
  ngOnDestroy() {
    this.receivedInvites.unsubscribe();
    this.getFriends.unsubscribe();
    this.dialogSubscription ? this.dialogSubscription.unsubscribe() : false;
    this.deletePollSub ? this.deletePollSub.unsubscribe() : false;
    this.acceptPollInviteSub ? this.acceptPollInviteSub.unsubscribe() : false;
    this.deletePollUser ? this.deletePollUser.unsubscribe() : false;
  }
}
