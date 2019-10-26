import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Gebruiker } from 'src/app/models/gebruiker.model';
import * as mail from 'src/assets/js/mail.js';
import { Friend } from 'src/app/models/friend.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

declare var sendMail: any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})


export class FriendsComponent implements OnInit {
  inviteForm: FormGroup;
  gebruiker: Gebruiker;
  receiver: Gebruiker;
  existingUser: boolean;
  vrienden$: Observable<Gebruiker[]>;
  sendedInvitations$: Observable<string[]>;
  receivedInvitations: Friend[];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.inviteForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
    this.vrienden$ = this.authService.getFriends();
    this.sendedInvitations$ = this.authService.getSendedInvitations();
    this.receivedInvitations = this.authService.getReceivedFriends();
  }

  onSubmit() { 
    this.authService.getGebruikerByEmail(this.inviteForm.value.email).subscribe(result => {
      console.log()
      if (result.email) {
        this.receiver = result;
        this.existingUser = true;
      } else {
        this.receiver = new Gebruiker(0, this.inviteForm.value.email, null, null, null, null, null);
        this.existingUser = false;
      }
      console.log(this.existingUser);
      //sendMail(this.inviteForm.value.email, this.authService.getGebruiker().gebruikersnaam, this.existingUser);
      this.authService.insertFriend(new Friend(0, this.authService.getGebruiker(), this.receiver, false)).subscribe(result => {
        console.log(result);
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
