import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import * as mail from 'src/assets/js/mail.js';
import { Friend } from 'src/app/models/friend.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material';

declare var sendInvite: any;
declare var sendFriendRequest: any;
declare var sendAcceptFriend: any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})


export class FriendsComponent implements OnInit {
  inviteForm: FormGroup;
  receiver: User;
  friends$: Observable<User[]>;
  sendedInvitations: string[];
  receivedInvitations: Friend[];

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.sendedInvitations = new Array<string>();
    this.inviteForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
    this.friends$ = this.authService.getFriends();
    this.authService.getSendedInvitations().subscribe(result => {
      this.sendedInvitations = result; 
    });
    this.receivedInvitations = this.authService.getReceivedFriends();
  }

  onSubmit() { 
    if (this.sendedInvitations.includes(this.inviteForm.value.email) || this.receivedInvitations.some(e => e.sender.email == this.inviteForm.value.email)) {
      this.snackbar.open('You already have invited or received an invitation of this person!', 'Friend request', {
        duration: 3000
      });
    } else {
      this.authService.getUserByEmail(this.inviteForm.value.email).subscribe(result => {
        if (result.email) {
          this.receiver = result;
          sendFriendRequest(this.inviteForm.value.email, this.authService.getUser().username);
        } else {
          this.receiver = new User(0, this.inviteForm.value.email, null, null, false, '00000000-0000-0000-0000-000000000000', null, null, null);
          sendInvite(this.inviteForm.value.email, this.authService.getUser().username);
        }
        this.authService.insertFriend(new Friend(0, this.authService.getUser(), this.receiver, false)).subscribe(result => {
          this.snackbar.open('Your friend is invited!', 'Friend request', {
            duration: 3000
          });
          //should stay on the same page
          this.router.navigate(['/dashboard']);
        });  
      });
    }
  }

  acceptInvitation(friendID: number) {
    this.authService.updateFriend(friendID).subscribe(result => {
      sendAcceptFriend(this.authService.getUser().email, this.authService.getUser().username);
      //should stay on the same page.
      this.router.navigate(['/dashboard']);
    });
  }

  declineInvitation(friendID: number) {
    this.authService.removeFriend(friendID).subscribe(result => {
      this.router.navigate(['/dashboard']);
    });
  }
}
