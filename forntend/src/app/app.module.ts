import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { AuthModule } from './components/auth/auth.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './components/auth/auth.interceptor';
import { AuthGuard } from './components/auth/auth.guard';
import { PollModule } from './components/poll/poll.module';
import { DialogModule } from './dialogs/dialog.module';
import { FriendsComponent } from './components/friends/friends.component';
import { OneOptionDialogComponent } from './dialogs/one-option-dialog/one-option-dialog.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { TwoOptionsDialogComponent } from './dialogs/two-options-dialog/two-options-dialog.component';
import { SharedModule } from './shared.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
//the app root module
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    FriendsComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    PollModule,
    DialogModule,
    StoreModule.forRoot(reducers),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    SharedModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    OneOptionDialogComponent,
    TwoOptionsDialogComponent]
})
export class AppModule { }