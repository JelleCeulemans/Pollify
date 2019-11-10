import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletePollComponent } from './delete-poll/delete-poll.component';
import { MaterialModule } from '../material.module';
import { InviteDialogComponent } from './invite-dialog/invite-dialog.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog/forgot-password-dialog.component';
import { OneOptionDialogComponent } from './one-option-dialog/one-option-dialog.component';



@NgModule({
  declarations: [DeletePollComponent, InviteDialogComponent, CreateUserDialogComponent, ForgotPasswordDialogComponent, OneOptionDialogComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DialogModule { }
