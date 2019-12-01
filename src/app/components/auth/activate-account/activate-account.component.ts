import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit, OnDestroy {
  //declarations
  guid: string;
  
  doActivate: boolean;
  user: User;

  //subscription
  private urlParam: Subscription;
  private userByGuid: Subscription;
  private activateUser: Subscription;

  //Make all necessary services available
  constructor(
    private route: ActivatedRoute,
    private userService: UserService) { }

  //Is executing when the activate account page is initializing.
  ngOnInit() {
    //This will set the doActivate variable default to false.
    this.doActivate = false;
    //This will extract the param (guid) from the URL
    this.urlParam = this.route.params.subscribe(params => {
      //The user is requested to the database with the given guid
      this.userByGuid = this.userService.getUserWhereGuid(params['guid']).subscribe(result => {
        //If the guid belongs to an user in the database
        if (result) {
          this.user = result;
          //If the user isn't already activated.
          //The user activated attrbuted will be changed from false into true in the database
          //And the doActivate variable is set to true.
          if (!result.activated) {
            result.activated = true;
            this.activateUser = this.userService.activateUser(result).subscribe(result => {
              this.doActivate = true;
            });
          }
        }
      });
    });
  }

  //Unsubscribe all subscriptions to avoid data leaks
  ngOnDestroy() {
    this.urlParam.unsubscribe();
    this.userByGuid.unsubscribe();
    this.activateUser ? this.activateUser.unsubscribe() : false;
    
  }
}
