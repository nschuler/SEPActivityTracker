import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { EducatorService } from '../../services/educator.service';
import { AuthService } from '../../services/auth.service';
import { ParentComponent } from '../parent/parent.component';
import { element } from 'protractor';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { ViewNoteComponent } from '../rooms/room-admin.component';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  profile: any;
  room_id: any;
  activityList = [];
  childrenList = [];
  today: Date = new Date();
  todayString = this.today.getFullYear() + "-" + ((this.today.getMonth()+1 < 10) ? "0" + (this.today.getMonth()+1) : (this.today.getMonth()+1)) + "-" + ((this.today.getDate() < 10) ? "0" + this.today.getDate() : this.today.getDate());

  constructor( private authService: AuthService, private educatorService: EducatorService, public dialog: MdDialog) { }

  ngOnInit() {
    this.educatorService.getProfile().subscribe(data => {
      if(data.success)
      {
        this.profile = data.educators[0];
        this.room_id = this.profile.room_id;

        this.educatorService.getTodaysActivitiesByRoomId(this.room_id, this.todayString).subscribe(activities => {
          if(activities.success)
          {
            for(var i = 0; i < activities.data.length; i++)
            {
              this.activityList.push(activities.data[i]);
            }
          }
        });

        this.educatorService.getChildrenInRoom(this.room_id).subscribe(children => {
          if(children.success)
          {
            for(var i = 0; i < children.children.length; i++)
            {
              this.childrenList.push(children.children[i]);
            }
          }
        });
      }
    });
  }

  viewActivity(activity) {
    console.log(activity);
  }

  viewNotes(notes) {
    let dialogRef = this.dialog.open(ViewNoteComponent, {
      width: '600px',
      data: {
          notes: JSON.parse(notes).notes,
      }
    });
  }

  formatDate(date) {
    return date.split("T")[0];
  }
}