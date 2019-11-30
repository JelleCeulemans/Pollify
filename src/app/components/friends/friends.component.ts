import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Friend } from 'src/app/models/friend.model';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material';
import { FriendService } from '../../services/friend.service';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})


export class FriendsComponent implements OnInit, OnDestroy {
  //declarations
  inviteForm: FormGroup;
  friends: User[];
  sendedInvitations: User[];
  receivedInvitations: Friend[];
  showSpinner: boolean;

  //Subscriptions
  private getFriends: Subscription;
  private getSendedInvitations: Subscription;
  private getReceivedInvitations: Subscription;

  //Make all necessary services available
  constructor(
    private snackbar: MatSnackBar,
    private friendService: FriendService,
    private userService: UserService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.showSpinner = false;
    this.friends = new Array<User>();
    this.sendedInvitations = new Array<User>();
    this.receivedInvitations = new Array<Friend>();
    this.inviteForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
    this.getFriends = this.userService.getFriends().subscribe(result => {
      this.friends = result;
    });
    this.getSendedInvitations = this.userService.getSendedInvitations().subscribe(result => {
      this.sendedInvitations = result;
    })
    this.getReceivedInvitations = this.friendService.getReceivedInvitations().subscribe(result => {
      this.receivedInvitations = result; 
      this.friendService.emitChangeFriends(result.length);
    });
  }

  onSubmit() { 
    this.showSpinner = true;
    if (this.sendedInvitations.some(e => e.email == this.inviteForm.value.email) || 
        this.receivedInvitations.some(e => e.sender.email == this.inviteForm.value.email ||
        this.friends.some(e => e.email == this.inviteForm.value.email))) {

      this.snackbar.open('You already have invited or received an invitation of this person or is already a friend!', 'Friend request', {
        duration: 3000
      });
      this.showSpinner = false;
    } else {
      //rewrite
      this.userService.getUserByEmail(this.inviteForm.value.email).subscribe(result => {
        if (result) {
          //sendFriendRequest(this.inviteForm.value.email, this.authService.getUser().username);
          this.inviteFriend(result);
        } else {
          //sendInvite(this.inviteForm.value.email, this.authService.getUser().username);
          this.inviteFriend(new User(0, this.inviteForm.value.email, null, null, false, '00000000-0000-0000-0000-000000000000', null, null, null));
        } 
      });
    }
  }

  inviteFriend(receiver: User) {
    this.friendService.insertFriend(new Friend(0, this.localStorageService.getUser(), receiver, false)).subscribe(result => {
      this.snackbar.open('Your friend is invited!', 'Friend request', {
        duration: 3000
      });
      this.ngOnInit();
      this.showSpinner = false;
    }); 
  }

  acceptInvitation(friendID: number) {
    this.friendService.updateFriend(friendID).subscribe(result => {
      //sendAcceptFriend(this.authService.getUser().email, this.authService.getUser().username);
      //UPDATE EMAIL
      this.ngOnInit();
    });
  }

  declineInvitation(friendID: number) {
    this.friendService.removeFriend(friendID).subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteFriend(userID: number) {
    this.friendService.deleteFriend(userID).subscribe(result => {
      this.ngOnInit();
    });
  }

  ngOnDestroy() {
    this.getFriends.unsubscribe();
    this.getSendedInvitations.unsubscribe();
    this.getReceivedInvitations.unsubscribe();
  }
}
