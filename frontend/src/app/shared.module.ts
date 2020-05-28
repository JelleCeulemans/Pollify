import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StringShortenerPipe } from './pipes/string-shortner.pipe';


//This shared modules collect all the modules that are frequently used.
@NgModule({
  declarations: [StringShortenerPipe],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    StringShortenerPipe
  ]
})
export class SharedModule { }
