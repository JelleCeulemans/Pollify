import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  //Declaration
  isAuthenticated$: Observable<boolean>;

  //Make all the necessary services available
  constructor(private store: Store<fromRoot.State>) { }

  //While initializing the component
  ngOnInit() {
    this.isAuthenticated$ = this.store.select(fromRoot.getIsAuth);
  }
}
