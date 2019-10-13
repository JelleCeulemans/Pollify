import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './app/login/login/login.component';
import { AppComponent } from './app/app.component';

const routes: Routes = [
    { path: '', component: AppComponent},
    { path: 'login', component: LoginComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}