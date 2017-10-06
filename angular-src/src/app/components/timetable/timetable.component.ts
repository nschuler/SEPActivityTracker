import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdDatepickerModule } from '@angular/material';
import { MdGridListModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { ParentService } from '../../services/parent.service';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabsModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';


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

  commentsArray = [];

  childInfo = Object;

  date: DateModel;
  options: DatePickerOptions;

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService,
    private parentService: ParentService,
    private router: Router,
    public dialog: MdDialog
    ) { }

  ngOnInit() {

    //console.log(this.parseURLParams(window.location.search));
    let childIdParam = this.route.snapshot.params['child'];
    console.log("Child with Id - ", childIdParam);

    this.parentService.getFamily().subscribe(data => {
      if (data.success) {
        this.familyName = data.family.familyName;
        this.address = data.family.address;
        this.boolLike = false;

        // Populate the child array
        for (var i = 0; i < data.family.children.length; i++) {
          if (data.family.children[i].id == childIdParam) {
            // this.childInfo.push({
            //   'firstName'   : data.family.children[i].first_name,
            //   'dob'         : data.family.children[i].dob,
            //   'familyId'    : data.family.children[i].family_id,
            //   'roomId'      : data.family.children[i].room_id,
            //   'allergens'   : data.family.children[i].allergens
            // })
            this.childInfo = data.family.children[i];
          }

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
          } else {
            this.childArray.push({
              'first_name': first_name,
              'dob': dob,
              'family_id': family_id,
              'room_id': room_id,
              'allergens': allergens,
              'child_id': child_id
              // 'activities': this.roomActivities
            });
          }
        }
      }

      console.log(this.childInfo);
    },
    err => {
      //console.log(err);
      return false;
    });

    this.options = new DatePickerOptions({
        format: 'YYYY-MM-DD',
        initialDate: new Date()
      });

    this.parentService.getActivityRecords("1").subscribe(data => {
      console.log(data);

      // if(data.success) {
      //   for(var i = 0; i < data.records.length; i++) {
      //     var JSONcomments = JSON.parse(data.records[i].comments);
      //     for(var x = 0; x < JSONcomments.comments.length; x++) {
      //       this.commentsArray.push(JSONcomments.comments[x].comment)
      //     }
      //   }
      // }
      this.commentsArray.push("Thanks for doing the painting exercises, my son would have loved them!")
    });

    this.parentService.getCurrentActivities("1").subscribe(activityData => {
      this.roomActivities = activityData.activities;
    });
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

  updateDate($event) {
    console.log('YTB')
  }

  getCurrentDate($event) {
    this.date=$event;
    console.log(this.date);
  }

  leaveComment(activity) {
     let dialogRef = this.dialog.open(MyDialogComponent, {
      width: '600px',
      data: {activity: activity.name, data: activity.description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
          this.commentsArray.push(result)
      }
    })
  }
}


@Component({
  selector: 'app-my-dialog',
  templateUrl: './my-dialog.component.html',
  styleUrls: ['./my-dialog.component.css']
})
export class MyDialogComponent implements OnInit {
  comment: any;
  constructor(public thisDialogRef: MdDialogRef<MyDialogComponent>, @Inject(MD_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    }

  onCloseConfirm() {
    this.thisDialogRef.close(this.comment);
  }

  onCloseCancel() {
    this.thisDialogRef.close(null);
  }
}
