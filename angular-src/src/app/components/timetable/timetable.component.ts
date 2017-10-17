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
  first_name: string;
  last_name: string;
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

  dateToday: string;

  familyName: string;
  address: string;
  roomActivities: any; //(temp)
  childActivities: string;

  childArray = [];
  notesArray = [];

  activityRecords = [];  // Archived activities.
  currentActivities = [];

  selectedActivities = [];
  selectedComments = [];
  chosenActivity = Object;

  childInfo = Object;
  childIdParam: number;

  date: DateModel;
  options: DatePickerOptions;
  today: Date = new Date();
  todayString = this.today.getFullYear() + "-" + ((this.today.getMonth()+1 < 10) ? "0" + (this.today.getMonth()+1) : (this.today.getMonth()+1)) + "-" + ((this.today.getDate() < 10) ? "0" + this.today.getDate() : this.today.getDate());

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
    this.first_name = JSON.parse(this.authService.loadUserData()).first_name;
    this.last_name = JSON.parse(this.authService.loadUserData()).last_name;

    let family = JSON.parse(this.parentService.loadFamily());

    if(family)
      this.displayChild(family);

    this.getFamily();

    this.options = new DatePickerOptions({
      format: 'YYYY-MM-DD',
      initialDate: new Date()
    });

    this.dateToday = String(this.options.initialDate);
    console.log(this.todayString)
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
        this.displayActivities();
        this.displayActivityRecords();
        break;
      }
    }
  }

  displayActivities() {
    if(this.child.room_id != null)
    {
      this.parentService.getActivities(this.child.room_id, this.todayString).subscribe(data => {
        if (data.success) {
          this.currentActivities = [];

          for (var i = 0; i < data.activities.length; i++) {
            this.currentActivities.push({
              start_time: data.activities[i].start_time,
              end_time: data.activities[i].end_time,
              type: data.activities[i].type,
              name: data.activities[i].name,
              description: data.activities[i].description,
              comments: [],
              disabled: true
            });
          }

          // Populate activities for today.
          this.selectedActivities = [];
          for (var i = 0; i < this.currentActivities.length; i++) {
            this.selectedActivities.push(this.currentActivities[i]);
          }
        }
      });
    }
  }

  displayActivityRecords() {
    // Populate recordActivities array
    this.parentService.getActivityRecords(this.child.id).subscribe(data => {
      if (data.success) {
        this.activityRecords = [];

        for (var i = 0; i < data.records.length; i++) {
          this.activityRecords.push({
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
  }

  getCurrentDate($event) {
    this.date = $event;
    this.selectedActivities = [];
    this.selectedComments = [] 


    if (String(this.date.formatted) == this.todayString) {
      for (var i = 0; i < this.currentActivities.length; i++) {
        this.selectedActivities.push(this.currentActivities[i]);
      }
    } else {
      for (var i = 0; i < this.activityRecords.length; i++) {
        if (this.date.formatted == this.activityRecords[i].date.split("T")[0]) {
          this.selectedActivities.push(this.activityRecords[i]);
        }
      }
    }
  }

  addComment(activity) {
    this.selectedComments = []

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
    }); 

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

        // Push comment to DB
        this.parentService.commentOnChildActivityRecord({activityrecord_id: activity.id, comment: result}).subscribe(data => {
          for(var i = 0; i < this.activityRecords.length; i++)
          {
            if(this.activityRecords[i].id == activity.id)
            {
              this.activityRecords[i].comments.push({comment: result, date:Date.now(), author: this.first_name + this.last_name});
            }
          }
        });
      }
    });
  }

  addNote() {
    let dialogRef = this.dialog.open(MyNoteComponent, {
      width: '600px',
    });

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

  formateDate2(date) {
    let dateObj = new Date(date);
    return dateObj.getFullYear() + "-" + ((dateObj.getMonth()+1 < 10) ? "0" + (dateObj.getMonth()+1) : (dateObj.getMonth()+1)) + "-" + ((dateObj.getDate() < 10) ? "0" + dateObj.getDate() : dateObj.getDate());
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

  removeComment(commentData, comment) {
    console.log(commentData)

    for (var x = 0; x < commentData.comments.length; x++) {
      console.log(commentData.comments[x])
    }

    this.parentService.deleteCommentOnChildActivityRecord({activityrecord_id: commentData.activityId, comment: comment}).subscribe(data => {
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