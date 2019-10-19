import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletePollComponent } from './delete-poll/delete-poll.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [DeletePollComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DialogModule { }
