import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { OrderModule } from 'ngx-order-pipe';
import { DndModule } from 'ng2-dnd';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TimetableComponent } from './components/timetable/timetable.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { ParentService } from './services/parent.service';
import { EducatorService } from './services/educator.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';



const appRoutes: Routes = [
	{path:'', component:HomeComponent},
	{path:'register', component:RegisterComponent},
	{path:'login', component:LoginComponent},
	{path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
	{path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
  {path:'timetable', component:TimetableComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    TimetableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    MaterialModule,
    BrowserAnimationsModule,
    OrderModule,
    DndModule.forRoot()
  ],
  providers: [ValidateService, AuthService, AuthGuard, ParentService, EducatorService, DndModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
