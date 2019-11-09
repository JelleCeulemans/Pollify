import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  private sub: any;
  guid: string;
  user: User;

  constructor(private route: ActivatedRoute, private authService: AuthService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', { validators: [Validators.required] }),
      confirmPassword: new FormControl('', { validators: [Validators.required] })
    });
    this.sub = this.route.params.subscribe(params => {
      this.authService.getUserWhereGuid(params['guid']).subscribe(result => {
        this.user = result;
      });
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.value.password == this.resetPasswordForm.value.confirmPassword) {
      this.authService.updatePassword(this.user).subscribe(result => {
        console.log(result);
      });
    } else {
      this.snackbar.open('Credentials are not recognised or account is not activated', 'Login failed', {
        duration: 3000
      });
      this.loginForm.setValue({
        email: this.loginForm.value.email,
        password: '',
      });
    }

  }

}
