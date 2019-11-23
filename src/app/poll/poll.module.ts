import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { VotePollComponent } from './vote-poll/vote-poll.component';
import { SharedModule } from '../shared.module';
import { MatTooltipModule } from '@angular/material';
import { VotingUsersPipe } from './tooltip.pipe';



@NgModule({
  declarations: [CreatePollComponent, VotePollComponent, VotingUsersPipe],
  imports: [
    CommonModule,
    SharedModule,
    MatTooltipModule
  ]
})
export class PollModule { }
