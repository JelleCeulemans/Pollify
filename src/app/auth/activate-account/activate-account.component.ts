import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit, OnDestroy {
  guid: string;
  private urlParam: any;
  doActivate: boolean;
  user: User;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  //Is executing when the activate account page is initializing.
  ngOnInit() {
    //This will set the doActivate variable default to false.
    this.doActivate = false;
    //This will extract the param (guid) from the URL
    this.urlParam = this.route.params.subscribe(params => {
      //The user is requested to the database with the given guid
      this.authService.getUserWhereGuid(params['guid']).subscribe(result => {
        //If the guid belongs to an user in the database
        if (result) {
          this.user = result;
          //If the user isn't already activated.
          //The user activated attrbuted will be changed from false into true in the database
          //And the doActivate variable is set to true.
          if (!result.activated) {
            result.activated = true;
            this.authService.activateUser(result).subscribe(result => {
              this.doActivate = true;
            });
          }
        }
      });
    });
  }

  //This will urlParam unsubscribe
  ngOnDestroy() {
    this.urlParam.unsubscribe();
  }
}
