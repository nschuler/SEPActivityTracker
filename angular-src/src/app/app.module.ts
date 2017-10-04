import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserXhr, HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdCardModule } from '@angular/material';
import { MdDatepickerModule, MdSelectModule, MdListModule } from '@angular/material';
import 'hammerjs';
import { OrderModule } from 'ngx-order-pipe';
import { DndModule } from 'ng2-dnd';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { MnFullpageModule } from 'ngx-fullpage';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from 'ng2-datepicker';

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
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { ParentService } from './services/parent.service';
import { EducatorService } from './services/educator.service';
import { RoomListComponent } from './components/rooms/room-list.component';
import { RoomEditComponent } from './components/rooms/room-edit.component';
import { RoomAddComponent } from './components/rooms/room-add.component';
import { RoomAdminComponent } from './components/rooms/room-admin.component';
import { RoomPlanComponent, DialogOverviewExampleDialog, DateTimePickerComponent } from './components/rooms/room-plan.component';
import { ActivitiesListComponent } from './components/activities/activities-list.component';
import { ActivitiesCreateComponent } from './components/activities/activities-create.component';
import { ActivitiesEditComponent } from './components/activities/activities-edit.component';

const appRoutes: Routes = [
  {path:'', component:HomeComponent},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
  {path:'timetable', component:TimetableComponent},
  {path:'rooms', component:RoomListComponent, canActivate:[AuthGuard]},
  {path:'rooms/create', component:RoomAddComponent, canActivate:[AuthGuard]},
  {path:'rooms/edit/:room', component:RoomEditComponent, canActivate:[AuthGuard]},
  {path:'rooms/plan/:room', component:RoomPlanComponent, canActivate:[AuthGuard]},
  {path:'rooms/admin/:room', component:RoomAdminComponent, canActivate:[AuthGuard]},
  {path:'activities', component:ActivitiesListComponent, canActivate:[AuthGuard]},
  {path:'activities/edit/:activity', component:ActivitiesEditComponent, canActivate:[AuthGuard]},
  {path:'activities/create', component:ActivitiesCreateComponent, canActivate:[AuthGuard]}
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
    TimetableComponent,
    RoomListComponent,
    RoomEditComponent,
    RoomAddComponent,
    RoomPlanComponent,
    RoomAdminComponent,
    ActivitiesListComponent,
    ActivitiesCreateComponent,
    ActivitiesEditComponent,
    DialogOverviewExampleDialog,
    DateTimePickerComponent,
    RoomAdminComponent
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
    MdCardModule,
    MdDatepickerModule,
    MdListModule,
    MdSelectModule,
    OrderModule,
    DndModule.forRoot(),
    NgProgressModule,
    MnFullpageModule.forRoot(),
    NgxPaginationModule,
    CalendarModule.forRoot(),
    NgbModalModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    DatePickerModule
  ],
  providers: [ValidateService, AuthService, AuthGuard, ParentService, EducatorService, DndModule, { provide: BrowserXhr, useClass: NgProgressBrowserXhr }],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog, DateTimePickerComponent]
})
export class AppModule { }
