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
  roomActivities: any; //(temp)
  childActivities: string;

  childArray = [];
  notesArray = [];

  activitiesArray = [];
  selectedActivities = [];
  selectedComments = [];
  chosenActivity = Object;

  test = ["1", "2", "3"];

  childInfo = Object;
  childIdParam: number;

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
    this.childIdParam = this.route.snapshot.params['child'];

    let family = JSON.parse(this.parentService.loadFamily());
    
    if(family)
      this.displayChild(family);

    this.getFamily();

    // EXAMPLE USE
    // this.parentService.deleteCommentOnChildActivityRecord({activityrecord_id: 1, comment: "This is my second comment"}).subscribe(data => {
    //   console.log(data);
    // });

    this.options = new DatePickerOptions({
      format: 'YYYY-MM-DD',
      initialDate: new Date()
    });

    // roomId is hard-coded.
    this.parentService.getActivityRecords("1").subscribe(data => {
      if (data.success) {
        for (var i = 0; i < data.records.length; i++) {
            this.activitiesArray.push(data.records[i]);
        }
      }

      console.log(this.activitiesArray);
    });

    this.parentService.getCurrentActivities("1").subscribe(activityData => {
      this.roomActivities = activityData.activities;
    });
  }

  getFamily() {
    this.parentService.getFamily().subscribe(data => {
      if(data.success) {
        this.displayChild(data.family);
      }
    },
    err => {
      console.log(err);
      return false;
    });
  }

  displayChild(family) {
    this.familyName = family.familyName;
    this.address = family.address;

    for (var i = 0; i < family.children.length; i++) {
      if (family.children[i].id == this.childIdParam) {
        this.childInfo = family.children[i];
      }
    }
  }

  getCurrentDate($event) {
    this.date = $event;
    this.selectedActivities = [];
    this.selectedComments = []

    //TELLS YOU DAY OF WEEK 
    // Where saturady = 0, sunday = 1, monday = 2, tuesday = 3 etc..
    //console.log(this.date.momentObj.day());

    for (var i = 0; i < this.activitiesArray.length; i++) {
      if (this.date.formatted == this.activitiesArray[i].date.split("T")[0]) {
        this.selectedActivities.push(this.activitiesArray[i]);
      }
    }

    console.log(this.selectedActivities);
  }

  addComment(activityId) {
    for (var i = 0; i < this.selectedActivities.length; i++) {
      if (activityId == this.selectedActivities[i].activity_record_id) {
        this.chosenActivity = this.selectedActivities[i];

        let commentsObj = JSON.parse(this.selectedActivities[i].comments)

        if (commentsObj.comments.length > 0) {
          console.log(commentsObj.comments.length)
          console.log(commentsObj.comments[0])
          console.log(commentsObj.comments[0].comment)

          this.selectedComments.push(commentsObj.comments[0].comment)
        }
      }
    }

    let dialogRef = this.dialog.open(MyCommentComponent, {
      width: '600px',
      data: {
        name: this.chosenActivity.name,
        comments: this.selectedComments
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.selectedComments.push(result)
      }
    });
  }

  addNote() {
    let dialogRef = this.dialog.open(MyNoteComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
          this.notesArray.push(result)
      }
    })
  }
}

@Component({
  selector: 'app-my-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.css']
})

export class MyNoteComponent implements OnInit {
  note: String;
  constructor(public thisDialogRef: MdDialogRef<MyNoteComponent>, @Inject(MD_DIALOG_DATA) public data: string) { }

  ngOnInit() {
  }

  onCloseConfirm() {
    this.thisDialogRef.close(this.note);
  }

  onCloseCancel() {
    this.thisDialogRef.close(null);
  }
}

@Component({
  selector: 'app-my-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})

export class MyCommentComponent implements OnInit {
  comment: String;
  constructor(public thisDialogRef: MdDialogRef<MyCommentComponent>, @Inject(MD_DIALOG_DATA) public data: string) { }

  ngOnInit() {
  }

  onCloseConfirm() {
    this.thisDialogRef.close(this.comment);
  }

  onCloseCancel() {
    this.thisDialogRef.close(null);
  }
}