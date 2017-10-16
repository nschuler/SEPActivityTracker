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
  username: string;
  child = {
    address: undefined,
    first_name: undefined,
    last_name: undefined,
    family_name: undefined,
    id: undefined,
    dob: undefined,
    allergens: undefined,
    room_id: undefined,
    notes: undefined,
  };

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
    this.username = JSON.parse(this.authService.loadUserData()).username;

    let family = JSON.parse(this.parentService.loadFamily());

    if(family)
      this.displayChild2(family);

    this.getFamily();

    //EXAMPLE USE of add comment
    // this.parentService.commentOnChildActivityRecord({activityrecord_id: 1, comment: "This is my second comment"}).subscribe(data => {
    //   console.log(data);
    // });)

    //EXAMPLE USE of delete comment
    // this.parentService.deleteCommentOnChildActivityRecord({activityrecord_id: 1, comment: "This is my second comment"}).subscribe(data => {
    //   console.log(data);
    // });

    //EXAMPLE USE of add note
    // this.parentService.addNote({child_id: 1, note: "Please make sure my son drinks plenty of water"}).subscribe(data => {
    //   console.log(data);
    // });

    //EXAMPLE USE of delete note
    // this.parentService.deleteNote({child_id: 1, note: "Please make sure my son drinks plenty of water"}).subscribe(data => {
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
          //this.recordActivities.push(data.records[i]);
          this.recordActivities.push({
            child_id: data.records[i].child_id,
            comments: JSON.parse(data.records[i].comments).comments,
            date: data.records[i].date,
            description: data.records[i].description,
            end_time: data.records[i].end_time,
            start_time: data.records[i].start_time,
            id: data.records[i].id,
            name: data.records[i].name,
            room_name: data.records[i].room_name,
            type: data.records[i].type,
          });
        }
      }
      //console.log(this.recordActivities);
    });

    // Populate currentActivities array
    // this.parentService.getCurrentActivities("3").subscribe(activityData => {
    //   if (activityData.success) {
    //     console.log("current", activityData);
    //     // for (var i = 0; i < activityData.activities.length; i++) {
    //     //   this.currentActivities.push(activityData.activities[i]);
    //     // }
    //   }

    //   //console.log(this.currentActivities);
    // });

    // let temp = new Date("2015-03");
    // this.parentService.getActivities("1",temp.toString()).subscribe(activityData => {
    //   if (activityData.success) {
    //     console.log("future", activityData);
    //     // for (var i = 0; i < activityData.activities.length; i++) {
    //       //   this.currentActivities.push(activityData.activities[i]);
    //       // }
    //     }

    //     //console.log(this.currentActivities);
    //   });
  }

  getFamily() {
    this.parentService.getFamily().subscribe(data => {
      if(data.success) {
        // this.displayChild(data.family);
        this.displayChild2(data.family);
      }
    },
    err => {
      console.log(err);
      return false;
    });
  }

  displayChild2(family) {
    this.familyName = family.familyName;
    this.address = family.address;

    for(var i = 0; i < family.children.length; i++)
    {
      if (family.children[i].id == this.childIdParam) {
        this.child = {
          address: family.children[i].address,
          first_name: family.children[i].first_name,
          last_name: family.children[i].last_name,
          family_name: family.children[i].family_name,
          id: family.children[i].id,
          dob: family.children[i].dob,
          allergens: family.children[i].allergens,
          room_id: family.children[i].room_id,
          notes: JSON.parse(family.children[i].notes).notes,
        }
        break;
      }
    }
  }

  // displayChild(family) {
  //   this.familyName = family.familyName;
  //   this.address = family.address;
  //   this.notesArray = [];

  //   for (var i = 0; i < family.children.length; i++) {
  //     if (family.children[i].id == this.childIdParam) {
  //       this.childInfo = family.children[i];

  //       let notes = JSON.parse(family.children[i].notes).notes;
  //       let date: Date;

  //       for(var j = 0; j < notes.length; j++) {
  //         date = new Date(notes[j].date);
  //         let formattedDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  //         this.notesArray.push({date:formattedDate,author: notes[j].author, note: notes[j].note});
  //       }
  //       break;
  //     }
  //   }
  // }

  getCurrentDate($event) {
    this.date = $event;
    this.selectedActivities = [];
    this.selectedComments = []

    //TELLS YOU DAY OF WEEK
    // Where saturady = 0, sunday = 1, monday = 2, tuesday = 3 etc..
    // console.log(this.date.momentObj.day());

    for (var i = 0; i < this.recordActivities.length; i++) {
      if (this.date.formatted == this.recordActivities[i].date.split("T")[0]) {
        this.selectedActivities.push(this.recordActivities[i]);
      }
    }
    //console.log(this.selectedActivities);
  }

  addComment(activity) {
    this.selectedComments = [];
    console.log(activity)

    for (var i = 0; i < activity.comments.length; i++) {
      this.selectedComments.push(activity.comments[i].comment)
    }

    let dialogRef = this.dialog.open(MyCommentComponent, {
        width: '600px',
        data: {
          name: activity.name,
          comments: this.selectedComments,
          activityId: activity.id
        }
      }) 

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

        // Push comment to DB
        this.parentService.commentOnChildActivityRecord({activityrecord_id: activity.id, comment: result}).subscribe(data => {
          console.log(data);

        this.selectedComments.push(result)
        });
      }
    })
  }

  addNote() {
    let dialogRef = this.dialog.open(MyNoteComponent, {
      width: '600px',
    });

    console.log(this.child)

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        var date: Date = new Date();
        let formattedDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
       
        // Push note to DB
        this.parentService.addNote({child_id: this.child.id, note: result}).subscribe(data => {
          console.log(data);
        });

        //this.notesArray.push({note:result, date:formattedDate, author:this.username});
        this.child.notes.push({note:result, date:formattedDate, author:this.username});
      }
    });
  }

  removeNote(note) {  
    this.parentService.deleteNote({child_id: this.child.id, note: note}).subscribe(data => {
      console.log(data);
    });

    for (var i = 0; i < this.child.notes.length; i++) {
      if (note == this.child.notes[i].note) {
        this.child.notes.splice(i, 1)
      }
    }
  }

  formatDate(date) {
    return date.substr(0,10);
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
  constructor(public thisDialogRef: MdDialogRef<MyCommentComponent>, @Inject(MD_DIALOG_DATA) public data: string, private parentService: ParentService) { }

  ngOnInit() {
  }

  removeComment(data, comment) {
    this.parentService.deleteCommentOnChildActivityRecord({activityrecord_id: data.activityId, comment: comment}).subscribe(data => {
      console.log(data);
    });
  }

  onCloseConfirm() {
    this.thisDialogRef.close(this.comment);
  }

  onCloseCancel() {
    this.thisDialogRef.close(null);
  }
}