import { Component, Injectable, EventEmitter, Input } from '@angular/core';
import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as Auth from './auth/auth.actions';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent {
  isAuthenticated$: Observable<boolean>;
  title = 'Pollify';
  emitter: EventEmitter<number> = new EventEmitter();
  @Input() receivedInvitations: number;

  constructor(private store: Store<fromRoot.State>, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(fromRoot.getIsAuth);
  }

  logout() {
    this.store.dispatch(new Auth.SetUnauthenticated());
    this.router.navigate(['/login']);
  }
}
