import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll/poll.service';
import { Observable } from 'rxjs';
import { isNumber } from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  countPolls: number;
  countUsers: number;

  constructor(private pollService: PollService) { }

  //Is executed on the initializing of the home component
  ngOnInit() {
    //When this function retrieves the an answer from the backend it will first see if it is a number or not.
    //If it is a number it will stop the spinner and desplay the number isntead.
    this.pollService.getCountPolls().subscribe(result => {
      if (isNumber(result)) {
        this.countPolls = result;
      }
    });

    //When this function retrieves the an answer from the backend it will first see if it is a number or not.
    //If it is a number it will stop the spinner and desplay the number isntead.
    this.pollService.getCountUsers().subscribe(result => {
        if (isNumber(result)) {
          this.countUsers = result;
        }
    });
  }
}
