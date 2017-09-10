import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ParentService } from '../../services/parent.service';
import { EducatorService } from '../../services/educator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  constructor(private authService: AuthService, private parentService: ParentService, private educatorService: EducatorService, private router: Router) { }

  ngOnInit() {
  	this.parentService.getTimetable().subscribe(data => {
  		console.log(data.msg);
  	},
  	err => {
  		console.log(err);
  		return false;
  	});

    this.parentService.getFamily().subscribe(data => {
      console.log(data);
    },
    err => {
      console.log(err);
      return false;
    });

    this.educatorService.getChildren().subscribe(data => {
      console.log(data);
    },
    err => {
      console.log(err);
      return false;
    });
  }
}
