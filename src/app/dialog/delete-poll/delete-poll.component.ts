import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-poll',
  templateUrl: './delete-poll.component.html',
  styleUrls: ['./delete-poll.component.scss']
})
export class DeletePollComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) { }

  ngOnInit() {
  }

}
