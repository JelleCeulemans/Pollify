import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { VotePollComponent } from './vote-poll/vote-poll.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';



@NgModule({
  declarations: [CreatePollComponent, VotePollComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PollModule { }
