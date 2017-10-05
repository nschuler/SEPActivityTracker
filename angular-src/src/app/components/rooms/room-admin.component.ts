import { Component, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild, TemplateRef, Inject, ChangeDetectorRef, forwardRef, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MnFullpageOptions, MnFullpageService } from 'ngx-fullpage';
import { EducatorService } from '../../services/educator.service';
import { MdDialogModule, MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerModule, MdListModule, MdSelectModule} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerOptions } from 'ng2-datepicker';


@Component({
  selector: 'app-room-admin',
  templateUrl: './room-admin.component.html',
  styleUrls: ['./room-admin.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RoomAdminComponent implements OnInit {
  room_id: number; // Identifies which room has been selected
  enrolledChildren = [];
  allChildren = [];
  educators = [];
  assignedEducators = [];
  enrolled = false;
  user: any;

  constructor(private authService: AuthService, public dialog: MdDialog, private route: ActivatedRoute, private location: Location, public fullpageService: MnFullpageService, private educatorService: EducatorService) { }

  ngOnInit() {
  	this.room_id = +this.route.snapshot.params['room'];

    this.user = JSON.parse(this.authService.loadUserData());

    this.educatorService.getChildrenInRoom(this.room_id).subscribe(data => {
      this.enrolledChildren = data.children;
    }, err => {console.log(err);});

    this.fetchEducators();
  }

  getAllChildren() {
    this.educatorService.getChildren().subscribe(data => {
      for (var i = 0; i < data.children.length; i++) {
        this.allChildren.push(
        {
          'id' : data.children[i].id,
          'name' : data.children[i].id + ". " + data.children[i].first_name + " " + data.children[i].last_name
        });
      }
    }, err => {console.log(err);});
  }

  fetchEducators() {
    this.educatorService.getEducators().subscribe(data => {
      if(data.success)
      {
        for (var i=0; i<data.educators.length; i++) {
            this.educators.push(data.educators[i])
        }
        this.fetchAssignedEducator()
      }
    }, err => {console.log(err);});
  }

  fetchAssignedEducator() {
    for (var i=0; i<this.educators.length; i++) {
      if (this.educators[i].room_id != null) {
        if (this.educators[i].id == this.user.id) {
          this.enrolled = true;
        }
        this.assignedEducators.push(this.educators[i])
      }
    }
  }

  deleteChild(child) {
    var index = this.enrolledChildren.indexOf(child);
    this.enrolledChildren.splice(index, 1);
  }

  deleteEducator(educator) {
    var index = this.assignedEducators.indexOf(educator);
    this.assignedEducators.splice(index, 1);
    if (educator.id == this.user.id) {
      this.enrolled = false;
    }
  }

  joinRoom() {
    this.enrolled = true;
    this.assignedEducators.push(this.user)
  }
}
