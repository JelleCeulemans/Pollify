import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { CreatePollComponent } from './poll/create-poll/create-poll.component';
import { VotePollComponent } from './poll/vote-poll/vote-poll.component';
import { FriendsComponent } from './friends/friends.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


//All the url routes for the app
// ** is for all unmatched routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'createPoll', component: CreatePollComponent, canActivate: [AuthGuard]},  
  { path: 'votePoll', component: VotePollComponent, canActivate: [AuthGuard]},
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard]},
  { path: 'activateAccount', component: ActivateAccountComponent},
  { path: 'activateAccount/:guid', component: ActivateAccountComponent},
  { path: 'forgotPassword', component: ForgotPasswordComponent},
  { path: 'resetPassword/:guid', component: ResetPasswordComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
