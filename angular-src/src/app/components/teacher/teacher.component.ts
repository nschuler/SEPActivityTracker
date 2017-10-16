import { Component, OnInit, ViewChild } from '@angular/core';
import { EducatorService } from '../../services/educator.service';
import { AuthService } from '../../services/auth.service';
import { ParentComponent } from '../parent/parent.component';
import { element } from 'protractor';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

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
  // child currently being viewed
  currentChild: any;
  // activities in current viewed room
  activities: any[];
  // children in current viewed room
  enrolledChildren: any[];
  // rooms available in drop down
  myRoom: any;
  myId: any;
  constructor( private authService: AuthService, private educatorService: EducatorService) { }

  ngOnInit() {


    this.myId = JSON.parse(this.authService.loadUserData()).id;
    // this could be cleaned up
    this.educatorService.getEducators().subscribe(data => {
      var i =0;
      while(i<data.educators.length){

        if(this.myId == data.educators[i].id){
          //this.room_id = data.educators[i].room_id;
         this.getRoom(data.educators[i].room_id);
          break;
        }
        i++;
      }
    }, err => {console.log(err);});
  }

  getRoom(room_id){

    this.educatorService.getRoomById(room_id)
    .subscribe(data => {
      this.myRoom = data.data[0];
  },
    err => {
      console.log("Failed to load Room By ID" + err);
  });

  this.educatorService.getActivitiesByRoomId(room_id)
  .subscribe(data => {
    this.activities = data.data;
    console.log(data.data);
},
  err => {
    console.log("Failed to load Room By ID" + err);
});

this.educatorService.getChildrenInRoom(room_id)
.subscribe(data => {
  this.enrolledChildren = data.children;
  this.currentChild = this.enrolledChildren[0];
  console.log(this.enrolledChildren[0]);
},
err => {
  console.log("Failed to load Room By ID" + err);
});
  }

  clickableBoi(panel,clicked){
    if(clicked.tagName != "INPUT"){
      if(panel.childNodes[3].checked == true){
        panel.childNodes[3].checked = false;
       }else{
        panel.childNodes[3].checked = true;
       }
    }
   console.log(panel.childNodes);
  // console.log(panel.childNodes[3].checked);
  }
}
