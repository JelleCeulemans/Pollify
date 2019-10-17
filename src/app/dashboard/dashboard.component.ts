import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromAuth from '../auth/auth.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store<fromAuth.State>) { }

  ngOnInit() {
    //this.isAuthenticated$ = this.store.select(fromAuth.getIsAuth);

  }

}
