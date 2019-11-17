import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-two-options-dialog',
  templateUrl: './two-options-dialog.component.html',
  styleUrls: ['./two-options-dialog.component.scss']
})
export class TwoOptionsDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) { }
  
  ngOnInit() {
  }

}
