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
  private sub: any;
  show: boolean;
  user: User;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.show = false;
    this.sub = this.route.params.subscribe(params => {
      this.guid = params['guid'];
      console.log(params['guid']);
      this.authService.getUserWhereGuid(params['guid']).subscribe(result => {
        if (result != null) {
          this.user = result;
          if (!result.activated) {
            result.activated = true;
            this.authService.activateUser(result).subscribe(result => {
              this.show = true;
            });
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
