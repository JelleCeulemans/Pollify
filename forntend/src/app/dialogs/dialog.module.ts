import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { OneOptionDialogComponent } from './one-option-dialog/one-option-dialog.component';
import { TwoOptionsDialogComponent } from './two-options-dialog/two-options-dialog.component';



@NgModule({
  declarations: [OneOptionDialogComponent, TwoOptionsDialogComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DialogModule { }
