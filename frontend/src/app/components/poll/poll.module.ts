import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { VotePollComponent } from './vote-poll/vote-poll.component';
import { SharedModule } from '../../shared.module';
import { MatTooltipModule } from '@angular/material';
import { VotingUsersPipe } from '../../pipes/tooltip.pipe';
import { ChartsModule} from 'ng2-charts';


//The poll module
@NgModule({
  declarations: [CreatePollComponent, VotePollComponent, VotingUsersPipe],
  imports: [
    CommonModule,
    SharedModule,
    MatTooltipModule,
    ChartsModule
  ]
})
export class PollModule { }
