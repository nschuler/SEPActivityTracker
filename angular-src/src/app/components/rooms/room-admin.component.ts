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
  loggedIn = false;
  user: any;

  roomChildren = [];
  otherChildren = [];
  roomEducators = [];

  constructor(private authService: AuthService, public dialog: MdDialog, private route: ActivatedRoute, private location: Location, public fullpageService: MnFullpageService, private educatorService: EducatorService) { }

  ngOnInit() {
  	this.room_id = +this.route.snapshot.params['room'];
    this.user = JSON.parse(this.authService.loadUserData());

    this.populateChildren();
    this.populateEducators();
  }

  populateChildren() {
    this.educatorService.getChildren().subscribe(data => {
      if(data.success)
      {
        this.roomChildren = [];
        this.otherChildren = [];
        for(var i = 0; i < data.children.length; i++)
        {
          if(data.children[i].room_id == this.room_id)
          {
            this.roomChildren.push(data.children[i]);
          } else {
            this.otherChildren.push(data.children[i]);
          }
        }
      }
    });
  }

  populateEducators() {
    this.educatorService.getEducators().subscribe(data => {
      if(data.success)
      {
        this.roomEducators = [];
        for(var i = 0; i < data.educators.length; i++) {
          if(data.educators[i].room_id == this.room_id)
          {
            if(data.educators[i].id == this.user.id)
            {
              this.loggedIn = true;
            }
            this.roomEducators.push(data.educators[i]);
          }
        }
      }
    });
  }

  addChild(child_id:string): void{
    this.educatorService.addChildToRoom(this.room_id, child_id).subscribe(data => {
      if(data.success)
      {
        this.populateChildren();
      }
    });
  }

  removeChild(child) {
    this.educatorService.removeChildFromRoom(child.id).subscribe(data => {
      if(data.success)
      {
        var index = this.roomChildren.indexOf(child);
        this.roomChildren.splice(index, 1);
        this.populateChildren();
      }
    });
  }

  leaveRoom() {
    this.educatorService.logoutOfRoom().subscribe(data => {
      if(data.success)
      {
        this.loggedIn = false;
        this.populateEducators();
        for(var i = 0; i < this.roomEducators.length; i++) {
          if(this.user.id == this.roomEducators[i].id)
          {
            this.roomEducators.splice(i, 1);
          }
        } 
      }
    });
  }

  joinRoom() {
    this.educatorService.loginToRoom(this.room_id).subscribe(data => {
      if(data.success)
      {
        this.roomEducators.push(this.user)
        this.populateEducators();
      }
    });
  }
}
