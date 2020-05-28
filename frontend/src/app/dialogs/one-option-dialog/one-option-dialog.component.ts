import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-one-option-dialog',
  templateUrl: './one-option-dialog.component.html',
  styleUrls: ['./one-option-dialog.component.scss']
})

//This is an template for one option dialogss
export class OneOptionDialogComponent implements OnInit {

  
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) { }

  ngOnInit() {
  }

}
