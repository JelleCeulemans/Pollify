import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { Router,  } from '@angular/router';
import { Poll } from '../models/poll.model';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { DeletePollComponent } from '../dialog/delete-poll/delete-poll.component';
import { Friend } from '../models/friend.model';
import { PollUser } from '../models/poll-user.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pollUsers: PollUser[];
  user: User;
  receivedInvitations: Friend[];
  
  constructor(
    private pollService: PollService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.pollUsers = new Array<PollUser>();
    this.initializePolls();
    this.authService.getReceivedInvitations().subscribe(result => {
      this.receivedInvitations = result;
      this.authService.setReceivedFriends(result);
      this.authService.emitChange(result.length);
      //if (result.length > 0) {
        
        // const inviteDialog = this.dialog.open(InviteDialogComponent, {
        //   data: {
        //     amount: result.length
        //   }
        // });
  
        // inviteDialog.afterClosed().subscribe(result => {
        //   if (result) {
        //     this.router.navigate(['/friends'])
        //   }
        // });
      //}
    });
  }

  initializePolls() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.pollService.getPollUsers(this.user.userID).subscribe(result => {
        this.pollUsers = result;
      });
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
      }
    });
  }
}
