import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Gebruiker } from 'src/app/models/gebruiker.model';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  inviteForm: FormGroup;
  gebruiker: Gebruiker;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.inviteForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
  }

  onSubmit() {
    this.authService.getGebruikerByEmail(this.inviteForm.value.email).subscribe(result => {
      if (result.email) {
        //insert friend with accepted false, send an email to let the user now of this invitation
      } else {
        //insert friend with only sender and accepted to false, use the id to create an email
        //maybe create another table with only invites for only the invites
      }
    });
  }

}
