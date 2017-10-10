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
  notesArray = [];
  commentsArray = [];

  activitiesArray = [];
  selectedActivities = [];
  

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

    this.options = new DatePickerOptions({
      format: 'YYYY-MM-DD',
      initialDate: new Date()
    });

    this.parentService.getActivityRecords("1").subscribe(data => {
      console.log(data);
      console.log(this.date.formatted);

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
    this.boolLike = false;

    for (var i = 0; i < family.children.length; i++) {
      if (family.children[i].id == this.childIdParam) {
        this.childInfo = family.children[i];
      }
    }
  }

  updateDate($event) {
    console.log('YTB')
  }

  getCurrentDate($event) {
    this.date=$event;
    console.log(this.date.formatted);

    this.selectedActivities = [];

    for (var i = 0; i < this.activitiesArray.length; i++) {
      if (this.date.formatted == this.activitiesArray[i].date.split("T")[0]) {
        this.selectedActivities.push(this.activitiesArray[i]);
      }
    }

    console.log(this.selectedActivities);
  }

  leaveComment(activity) {
    let dialogRef = this.dialog.open(MyNoteComponent, {
      width: '600px',
      data: {activity: activity.name, data: activity.description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.commentsArray.push(result)
      }
    })
  }

  addComment(activityId) {
    console.log(activityId);

    let dialogRef = this.dialog.open(MyCommentComponent, {
      width: '600px',
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
    console.log(this.comment);
  }

  onCloseCancel() {
    this.thisDialogRef.close(null);
  }
}