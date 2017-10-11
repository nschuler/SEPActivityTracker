import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ParentService } from '../../services/parent.service';
import { EducatorService } from '../../services/educator.service';
import { Router } from '@angular/router';
import { getHours } from 'date-fns';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  children: any[] = [];
  today: Date = new Date;
  greeting: string;
  userName: string;
  constructor(private authService: AuthService, private parentService: ParentService, private educatorService: EducatorService, private router: Router) { }

  ngOnInit() {
    // id put this into a fucntion if i knew how, im so sorry
    if(this.today.getHours() < 12){
      this.greeting = "Good Morning";
     }else if(this.today.getHours() < 17){
      this.greeting = "Good Evening";
     }else{
      this.greeting = "Good Afternoon";
     }
     //
     this.authService.getProfile().subscribe(profile => {
      this.userName = profile.user.first_name + " " + profile.user.last_name;
    },
    err => {
      console.log(err);
      return false;
    });

     //family
    this.parentService.getFamily().subscribe(data => {
     //assign children to the child object for display purposes
      for(let i in data.family.children){
        this.children.push(new Child(data.family.children[i].first_name , data.family.familyName, data.family.children[i].family_id, data.family.children[i].id, data.family.children[i].room_id));
    }

    },
    err => {
      console.log(err);
      return false;
    });
  }
}


class Child {
  firstName: string;
  familyName: string;
  dob: string;
  address: string;
  famId: string;
  childId: string;
  roomId: string;

  constructor(firstname: string, familyName: string, famId: string, childId: string, roomId: string ) {
    this.firstName = firstname;
    this.familyName = familyName;
    this.childId = childId;
    this.roomId = roomId;

  }
}
