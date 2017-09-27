import { Component, OnInit } from '@angular/core';
import { MdDatepickerModule } from '@angular/material';
import { MdGridListModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { ParentService } from '../../services/parent.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  family: Object;
  firstName: string;
  familyName: string;
  dob: string;
  address: string;
  allergies: string;
  famId: string;
  childId: string;
  roomId: string;
  boolLike: boolean;

  constructor(
    private authService: AuthService, 
    private parentService: ParentService,
    private router: Router
    ) {}

  ngOnInit() {
    // this.parentService.getTimetable().subscribe(data => {
    //   console.log(data.msg);
    // },
    // err => {
    //   console.log(err);
    //   return false;
    // });

    // EXAMPLE of getCurrentActivities(<room_id>)
    
    // this.parentService.getCurrentActivities("1").subscribe(data => {
    //   console.log("current activities ", data);
    // },
    // err => {
    //   console.log(err);
    //   return false;
    // });

    this.parentService.getFamily().subscribe(data => {
      this.family = data.family;
      this.firstName = data.family.children[0].first_name;
      this.familyName = data.family.familyName;
      this.dob = data.family.children[0].dob;
      this.address = data.family.address;
      this.allergies = data.family.children[0].allergens;
      this.famId = data.family.children[0].family_id;
      this.childId = data.family.children[0].id;
      this.roomId = data.family.children[0].room_id;
      this.boolLike = false;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  openDatepicker() {
    console.log("Clickity click click!");
  }

  likeActivity() {
    if(this.boolLike == true) {
      console.log("You have unliked this activity!");
      this.boolLike = false;
    } else {
      console.log("You have liked this activity!");
      this.boolLike = true;
    }
  }

  leaveComment() {
    console.log("Leave a comment!");
  }
}
