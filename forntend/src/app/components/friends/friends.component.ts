import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Friend } from 'src/app/models/friend.model';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material';
import { FriendService } from '../../services/friend.service';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';

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
  user: User;

  //Subscriptions
  private getFriends: Subscription;
  private getSendedInvitations: Subscription;
  private getReceivedInvitations: Subscription;
  private getUserByEmail: Subscription
  private insertFriend: Subscription;
  private updateFriend: Subscription;
  private removeFriend: Subscription;
  private deleteFriendSub: Subscription;

  //Make all necessary services available
  constructor(
    private snackbar: MatSnackBar,
    private friendService: FriendService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private emailService: EmailService) { }

  //While the component is initializing
  ngOnInit() {
    //The spinner is hided by default
    this.showSpinner = false;
    //Define 3 empty arrays
    this.friends = new Array<User>();
    this.sendedInvitations = new Array<User>();
    this.receivedInvitations = new Array<Friend>();
    //Creating a form with validation rules for the form
    //The email is required and need to be valid
    this.inviteForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
    //Get all your friends
    this.getFriends = this.userService.getFriends().subscribe(result => {
      this.friends = result;
    });
    //Get all the sent friend request
    this.getSendedInvitations = this.userService.getSendedInvitations().subscribe(result => {
      this.sendedInvitations = result;
    })
    //Get all received friend request
    this.getReceivedInvitations = this.friendService.getReceivedInvitations().subscribe(result => {
      this.receivedInvitations = result;
      //Emit the amount of friend request to the parent component to make it visible if its more than zero
      this.friendService.emitChangeFriends(result.length);
    });
  }

  onSubmit() {
    //Show the spinner
    this.showSpinner = true;
    //Check if the given email isn't already known
    if (this.sendedInvitations.some(e => e.email == this.inviteForm.value.email) ||
      this.receivedInvitations.some(e => e.sender.email == this.inviteForm.value.email ||
        this.friends.some(e => e.email == this.inviteForm.value.email))) {
      //Shown a snackbar that the email is already known
      this.snackbar.open('You already have invited or received an invitation of this person or is already a friend!', 'Friend request', {
        duration: 3000
      });
      //Stop the spinner
      this.showSpinner = false;
    } else {
      //Check if the email is connected to a user
      this.getUserByEmail = this.userService.getUserByEmail(this.inviteForm.value.email).subscribe(result => {
        //If the user exist
        if (result) {
          //Create the friend on the database
          this.inviteFriend(result);
          //Send an friend request email
          this.emailService.friendRequest(result).subscribe();
        } else {
          //Create a new user's objecvt
          this.user = new User(0, this.inviteForm.value.email, null, null, false, '00000000-0000-0000-0000-000000000000', null, null, null)
          //Create the friend on the database
          this.inviteFriend(this.user);
          //Send an email to invite the user
          this.emailService.invite({...this.user}).subscribe();
        }
      });
    }
  }

  //Create the friend object in the database
  inviteFriend(receiver: User) {
    this.insertFriend = this.friendService.insertFriend(new Friend(0, this.localStorageService.getUser(), receiver, false)).subscribe(result => {
      //Show a snackbar to inform the user his friend is invited
      this.snackbar.open('Your friend is invited!', 'Friend request', {
        duration: 3000
      });
      //Stop the spinner
      this.showSpinner = false;
      //reload the component
      this.ngOnInit();
    });
  }

  //Accept the friend request
  acceptInvitation(friendID: number) {
    //Update the friend request
    this.updateFriend = this.friendService.updateFriend(friendID).subscribe(result => {
      //send an email to inform that the sender has a new friend
      this.emailService.newFriend(result.receiver).subscribe();
      //reload the component
      this.ngOnInit();
    });
  }

  //Decline the friend request
  declineInvitation(friendID: number) {
    //remove the friend connection in the database
    this.removeFriend = this.friendService.removeFriend(friendID).subscribe(result => {
      //reload the component
      this.ngOnInit();
    });
  }

  //Delete a friend connection
  deleteFriend(userID: number) {
    //remove the friend
    this.deleteFriendSub = this.friendService.deleteFriend(userID).subscribe(result => {
      //reload the component
      this.ngOnInit();
    });
  }

  //Unsubscribe all subscriptions avoid data leaks
  ngOnDestroy() {
    this.getFriends.unsubscribe();
    this.getSendedInvitations.unsubscribe();
    this.getReceivedInvitations.unsubscribe();
    this.getUserByEmail ? this.getUserByEmail.unsubscribe() : false;
    this.insertFriend ? this.insertFriend.unsubscribe() : false;
    this.updateFriend ? this.updateFriend.unsubscribe() : false;
    this.removeFriend ? this.removeFriend.unsubscribe() : false;
    this.deleteFriendSub ? this.deleteFriendSub.unsubscribe() : false;
  }
}
