import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  user: Object;
  educator: boolean;
  parent: boolean;

  constructor(private flashMessage: FlashMessagesService, private educatorService: EducatorService, private authService: AuthService){}

  ngOnInit() {
    this.educator = false;
    this.parent = false;

    this.user = JSON.parse(this.authService.loadUserData());
    this.display(this.user);
  }

  display(user) {
    switch(user.role_type)
    {
      case 1: this.parent = true;
      break;
      case 2: this.educator = true;
      break;
    }
  }
}