import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import * as mail from 'src/assets/js/mail.js';
import { Friend } from 'src/app/models/friend.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material';
import { find, filter } from 'rxjs/operators';

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
  friends: User[];
  sendedInvitations: User[];
  receivedInvitations: Friend[];

  constructor(
    private authService: AuthService, 
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.friends = new Array<User>();
    this.sendedInvitations = new Array<User>();
    this.receivedInvitations = new Array<Friend>();
    this.inviteForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
    this.authService.getFriends().subscribe(result => {
      this.friends = result;
    });
    this.authService.getSendedInvitations().subscribe(result => {
      this.sendedInvitations = result;
    })
    this.authService.getReceivedInvitations().subscribe(result => {
      this.receivedInvitations = result; 
      this.authService.emitChange(result.length);
    });
  }

  onSubmit() { 
    // this.friends$.pipe(filter(a => a.some(b => b.email == this.inviteForm.value.email))).subscribe(result => {
    //   console.log(result);
    // });
    //hoe werkt dit met obervables
    if (this.sendedInvitations.some(e => e.email == this.inviteForm.value.email) || 
        this.receivedInvitations.some(e => e.sender.email == this.inviteForm.value.email ||
        this.friends.some(e => e.email == this.inviteForm.value.email))) {

      this.snackbar.open('You already have invited or received an invitation of this person or is already a friend!', 'Friend request', {
        duration: 3000
      });
    } else {
      //rewrite
      this.authService.getUserByEmail(this.inviteForm.value.email, false).subscribe(result => {
        console.log(result);
        if (result) {
          //sendFriendRequest(this.inviteForm.value.email, this.authService.getUser().username);
          //this.inviteFriend(result);
        } else {
          //sendInvite(this.inviteForm.value.email, this.authService.getUser().username);
          //this.inviteFriend(new User(0, this.inviteForm.value.email, null, null, false, '00000000-0000-0000-0000-000000000000', null, null, null));
        } 
      });
    }
  }

  inviteFriend(receiver: User) {
    this.authService.insertFriend(new Friend(0, this.authService.getUser(), receiver, false)).subscribe(result => {
      this.snackbar.open('Your friend is invited!', 'Friend request', {
        duration: 3000
      });
      this.ngOnInit();
    }); 
  }

  acceptInvitation(friendID: number) {
    this.authService.updateFriend(friendID).subscribe(result => {
      sendAcceptFriend(this.authService.getUser().email, this.authService.getUser().username);
      console.log(this.receivedInvitations);
      this.ngOnInit();
    });
  }

  declineInvitation(friendID: number) {
    this.authService.removeFriend(friendID).subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteFriend(userID: number) {
    this.authService.deleteFriend(userID).subscribe(result => {
      console.log(result);
      this.ngOnInit();
    });
  }
}
