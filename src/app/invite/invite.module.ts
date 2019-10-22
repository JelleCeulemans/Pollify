import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptInviteComponent } from './accept-invite/accept-invite.component';
import { InviteComponent } from './invite/invite.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [AcceptInviteComponent, InviteComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class InviteModule { }
