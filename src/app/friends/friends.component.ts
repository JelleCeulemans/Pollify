import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import * as mail from 'src/assets/js/mail.js';
import { Friend } from 'src/app/models/friend.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

declare var sendMail: any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})


export class FriendsComponent implements OnInit {
  inviteForm: FormGroup;
  user: User;
  receiver: User;
  existingUser: boolean;
  friends$: Observable<User[]>;
  sendedInvitations$: Observable<string[]>;
  receivedInvitations: Friend[];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.inviteForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
    this.friends$ = this.authService.getFriends();
    this.sendedInvitations$ = this.authService.getSendedInvitations();
    this.receivedInvitations = this.authService.getReceivedFriends();
  }

  onSubmit() { 
    this.authService.getUserByEmail(this.inviteForm.value.email).subscribe(result => {
      if (result.email) {
        this.receiver = result;
        this.existingUser = true;
      } else {
        this.receiver = new User(0, this.inviteForm.value.email, null, null, null, null, null);
        this.existingUser = false;
      }
      console.log(this.existingUser);
      //sendMail(this.inviteForm.value.email, this.authService.getUser().username, this.existingUser);
      this.authService.insertFriend(new Friend(0, this.authService.getUser(), this.receiver, false)).subscribe(result => {
        this.router.navigate(['/dashboard']);
      });  
    });
  }

  acceptInvitation(friendID: number) {
    this.authService.updateFriend(friendID).subscribe(result => {
      this.router.navigate(['/dashboard']);
    });
  }

  declineInvitation(friendID: number) {
    this.authService.removeFriend(friendID).subscribe(result => {
      this.router.navigate(['/dashboard']);
    })
  }
}
