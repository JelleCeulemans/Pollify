import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletePollComponent } from './delete-poll/delete-poll.component';
import { MaterialModule } from '../material.module';
import { InviteDialogComponent } from './invite-dialog/invite-dialog.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';



@NgModule({
  declarations: [DeletePollComponent, InviteDialogComponent, CreateUserDialogComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DialogModule { }
