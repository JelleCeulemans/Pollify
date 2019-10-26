import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { PollService } from '../poll.service';
import { PollGebruiker } from '../models/pollgebruiker.model';
import { Router, NavigationEnd } from '@angular/router';
import { Poll } from '../models/poll.model';
import { Gebruiker } from '../models/gebruiker.model';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { DeletePollComponent } from '../dialog/delete-poll/delete-poll.component';
import { Observable } from 'rxjs';
import { Friend } from '../models/friend.model';
import { async } from 'q';
import { InviteDialogComponent } from '../dialog/invite-dialog/invite-dialog.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pollGebruikers: PollGebruiker[];
  gebruiker: Gebruiker;
  receivedInvitations: Friend[];
  
  constructor(
    private pollService: PollService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.pollGebruikers = new Array<PollGebruiker>();
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
    this.gebruiker = this.authService.getGebruiker();
    if (this.gebruiker) {
      this.pollService.getPollGebruikers(this.gebruiker.gebruikerID).subscribe(result => {
        this.pollGebruikers = result;
      });
    }
  }

  vote(poll: Poll) {
    this.pollService.setPoll(poll);
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
