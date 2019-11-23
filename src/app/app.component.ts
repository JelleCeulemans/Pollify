import { Component, Injectable} from '@angular/core';
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
  receivedInvitations: number;
  title = 'Pollify';
  
  constructor(private store: Store<fromRoot.State>, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.receivedInvitations = 0;
    this.authService.changeEmitted$.subscribe(result => {
      this.receivedInvitations = result;
    });
    this.isAuthenticated$ = this.store.select(fromRoot.getIsAuth);
  }

  logout() {
    this.store.dispatch(new Auth.SetUnauthenticated());
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
