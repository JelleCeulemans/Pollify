import { Component, OnInit, OnDestroy } from '@angular/core';
import { PollService } from '../../services/poll.service';
import { isNumber } from 'util';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  //declarations
  countPolls: number;
  countUsers: number;

  //Subscriptions
  private getCountPolls: Subscription;
  private getCountUsers: Subscription;

  //Making the necessary services available
  constructor(
    private pollService: PollService,
    private userService: UserService) { }

  //Is executed on the initializing of the home component
  ngOnInit() {
    //When this function retrieves the an answer from the backend it will first see if it is a number or not.
    //If it is a number it will stop the spinner and desplay the number isntead.
    this.getCountPolls = this.pollService.getCountPolls().subscribe(result => {
      
      this.countPolls = result;
    });

    //When this function retrieves the an answer from the backend it will first see if it is a number or not.
    //If it is a number it will stop the spinner and desplay the number isntead.
    this.getCountUsers = this.userService.getCountUsers().subscribe(result => {
      this.countUsers = result;
    });
  }

  //Unsubscribe all subscriptions to avoid data leaks
  ngOnDestroy() {
    this.getCountPolls.unsubscribe();
    this.getCountUsers.unsubscribe();
  }
}
