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


  // child currently being viewed
  currentChild: any;
  // activities in current viewed room
  activities: any[];
  // children in current viewed room
  enrolledChildren: Child[] = [];
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
},
  err => {
    console.log("Failed to load Room By ID" + err);
});

this.educatorService.getChildrenInRoom(room_id)
.subscribe(data => {
  //this.enrolledChildren = data.children;
  var i = 0;
  //this.enrolledChildren = data.children;
  while(i< data.children.length ){
    this.makeChild(data.children[i].first_name, data.children[i].last_name, data.children[i].id,data.children[i].dob,data.children[i].allergens,data.children[i].notes,i)
    i++;
  }
  this.currentChild = this.enrolledChildren[0];
},
err => {
  console.log("Failed to load Room By ID" + err);
});
  }

  clickableBoi(panel,clicked,i){
    if(clicked.tagName != "INPUT"){
      if(panel.childNodes[i].checked == true){
        panel.childNodes[i].checked = false;
       }else{
        panel.childNodes[i].checked = true;
       }
    }
  // console.log(panel.childNodes[3].checked);
  }

  makeChild(fName, lName, id,dob,allergens,notes,i){
    var formattedNotes = JSON.parse(notes).notes;
    //this.enrolledChildren.push(
     var temp = new Child(fName, lName, id, dob, allergens, formattedNotes);
     //if(this.enrolledChildren == undefined){console.log("25-8 pun2k weight 25-8 pun2k weight 25-8 pun2k weight Out yo flesh Out yo flesh")}
     this.enrolledChildren.push(temp);
  }

}
class Child {
  firstName: any;
  familyName: any;
  dob: any;
  address: string;
  allergens: any;
  childId: any;
  notes: any;

  constructor(firstname, familyName, childId, dob, allergens, notes ) {
    this.firstName = firstname;
    this.familyName = familyName;
    this.childId = childId;
    this.dob = dob;
    this.allergens = allergens;
    this.notes = notes;

  }
}
