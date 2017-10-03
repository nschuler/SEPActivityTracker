import { Component, OnInit } from '@angular/core';
import { MdDatepickerModule } from '@angular/material';
import { MdGridListModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { ParentService } from '../../services/parent.service';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabsModule } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  familyName: string;
  address: string;
  boolLike: boolean;

  roomActivities: any; //(temp)

  childActivities: string;

  childArray = [];

  date: DateModel;
  options: DatePickerOptions;

  constructor(
    private authService: AuthService,
    private parentService: ParentService,
    private router: Router
    ) {
      this.options = new DatePickerOptions();
    }

  ngOnInit() {
<<<<<<< HEAD
    //get Id from below!
    console.log(this.parseURLParams(window.location.search));

    // Example -
    // this.parentService.getActivityRecords("1").subscribe(data => {
    //   console.log(data);
    // });

    this.parentService.getCurrentActivities("1").subscribe(activityData => {
      this.roomActivities = activityData.activities;
    });

    this.parentService.getFamily().subscribe(data => {
      if(data.success)
      {
        this.familyName = data.family.familyName;
        this.address = data.family.address;
        this.boolLike = false;


        // Populate the child array
        for (var i = 0; i < data.family.children.length; i++) {
          var first_name = data.family.children[i].first_name
          var dob = data.family.children[i].dob
          var family_id = data.family.children[i].family_id
          var room_id = data.family.children[i].room_id
          var allergens = data.family.children[i].allergens
          var child_id = data.family.children[i].id

          if(room_id == 1)
          {
            this.childArray.push({
              'first_name': first_name,
              'dob': dob,
              'family_id': family_id,
              'room_id': room_id,
              'allergens': allergens,
              'child_id': child_id,
              'activities': this.roomActivities
            });
          }


          // this.parentService.getCurrentActivities(data.family.children[i].room_id).subscribe(activityData => {
          //   this.childActivities = activityData.activities;
          //   this.childArray.push({
          //     'first_name': first_name,
          //     'dob': dob,
          //     'family_id': family_id,
          //     'room_id': room_id,
          //     'allergens': allergens,
          //     'child_id': child_id,
          //     'activities': this.childActivities
          //   });
          // });
        }
      }
>>>>>>> master
    },
    err => {
      //console.log(err);
      return false;
    });
  }
  //stolen from https://stackoverflow.com/questions/814613/how-to-read-get-data-from-a-url-using-javascript
  parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

  openDatepicker() {
    console.log("Clickity click click!");
    console.log(this.childArray)
  }

  likeActivity() {
    if(this.boolLike == true) {
      console.log("You have unliked this activity!");
          console.log(this.childArray)
      this.boolLike = false;
    } else {
      console.log("You have liked this activity!");
          console.log(this.childArray)

      this.boolLike = true;
    }
  }

  leaveComment() {
    console.log("Leave a comment!");
  }
}
