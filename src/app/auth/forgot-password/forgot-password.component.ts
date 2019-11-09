import { Component, OnInit } from '@angular/core';
import * as mail from 'src/assets/js/mail.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

declare var resetPassword: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('info@jelleceulemans.be', { validators: [Validators.required, Validators.email] })
    });
  }

  onSubmit() {
    this.authService.getUserByEmail(this.forgotPasswordForm.value.email).subscribe(result => {
      resetPassword(result.email, result.username, result.guid);
      //dialog or snackbar to show that the email is sended
    });
  }

}
