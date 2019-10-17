import { Component, Injectable } from '@angular/core';
import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as Auth from './auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent {
  isAuthenticated$: Observable<boolean>;
  title = 'Pollify';

  constructor(private store: Store<fromRoot.State>, private router: Router) { }

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(fromRoot.getIsAuth);
  }

  logout() {
    this.store.dispatch(new Auth.SetUnauthenticated());
    this.router.navigate(['/login']);
  }
}
