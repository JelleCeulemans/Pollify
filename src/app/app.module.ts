import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { PollModule } from './poll/poll.module';
import { DialogModule } from './dialog/dialog.module';
import { DeletePollComponent } from './dialog/delete-poll/delete-poll.component';
import { FriendsComponent } from './friends/friends.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InviteDialogComponent } from './dialog/invite-dialog/invite-dialog.component';
import { CreateUserDialogComponent } from './dialog/create-user-dialog/create-user-dialog.component';
import { ForgotPasswordDialogComponent } from './dialog/forgot-password-dialog/forgot-password-dialog.component';
import { OneOptionDialogComponent } from './dialog/one-option-dialog/one-option-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    FriendsComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AuthModule,
    PollModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(reducers)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    DeletePollComponent, 
    InviteDialogComponent, 
    CreateUserDialogComponent,
    ForgotPasswordDialogComponent,
    OneOptionDialogComponent]
})
export class AppModule { }
