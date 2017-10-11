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

  recordActivities = [];  // Archived activities.
  currentActivities = [];

  selectedActivities = [];
  selectedComments = [];
  chosenActivity = Object;

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

    //EXAMPLE USE of add note
    // this.parentService.addNote({child_id: 1, note: "This is my first ever note"}).subscribe(data => {
    //   console.log(data);
    // });

    //EXAMPLE USE of delete note
    // this.parentService.deleteNote({child_id: 1, note: "This is my first ever note"}).subscribe(data => {
    //   console.log(data);
    // });

    this.options = new DatePickerOptions({
      format: 'YYYY-MM-DD',
      initialDate: new Date()
    });

    // Populate recordActivities array
    this.parentService.getActivityRecords("1").subscribe(data => {
      if (data.success) {
        for (var i = 0; i < data.records.length; i++) {
          this.recordActivities.push(data.records[i]);
        }
      }

      console.log(this.recordActivities);
    });

    // Populate currentActivities array
    this.parentService.getCurrentActivities("1").subscribe(activityData => {
      if (activityData.success) {
        for (var i = 0; i < activityData.activities.length; i++) {
          this.currentActivities.push(activityData.activities[i]);
        }
      }

      console.log(this.currentActivities);
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
    console.log(this.date.momentObj.day());

    for (var i = 0; i < this.recordActivities.length; i++) {
      if (this.date.formatted == this.recordActivities[i].date.split("T")[0]) {
        this.recordActivities[i].comments = JSON.parse(this.recordActivities[i]['comments']);
        this.selectedActivities.push(this.recordActivities[i]);
      }
    }

    console.log(this.selectedActivities);
  }

  addComment(activity) {
    console.log(activity)
    console.log(activity.comments.comments[0])

    if (activity.comments.comments.length == 0) {
      let dialogRef = this.dialog.open(MyCommentComponent, {
        width: '600px',
        data: {
          name: activity.name
        }
      })
    } else {
      let dialogRef = this.dialog.open(MyCommentComponent, {
        width: '600px',
        data: {
          name: activity.name,
          comments: [activity.comments.comments[0].comment]
        }
      })     
    }
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

  expandBoy($event){
    var panel = $event.toElement.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
  } else {
      panel.style.display = "block";
  }
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
