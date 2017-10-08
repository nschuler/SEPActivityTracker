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
  first_name: string;

  constructor(private authService: AuthService, private parentService: ParentService, private educatorService: EducatorService, private router: Router) { }

  ngOnInit() {
    this.first_name = JSON.parse(this.authService.loadUserData()).first_name;

    let family = JSON.parse(this.parentService.loadFamily());
    if(family)
    {
      this.displayFamily(family);
    }

    this.getFamily();
    this.setGreeting();
  }

  getFamily() {
    this.parentService.getFamily().subscribe(data => {
      if(data.success)
      {
        this.parentService.storeFamily(data.family);
        this.displayFamily(data.family);
      }
    },
    err => {
      console.log(err);
      return false;
    });
  }

  displayFamily(family) {
    let temp = 0;

    this.children = [];

    for(let i in family.children){
      this.children.push(new Child(family.children[i].first_name , family.familyName, family.children[i].family_id, family.children[i].id, family.children[i].room_id));
    }
  }

  setGreeting() {
    let time = this.today.getHours();
    if(time <= 12 && time >= 4){
      this.greeting = "Good Morning";
    }else if(time > 17){
      this.greeting = "Good Evening";
    }else if(time <= 17){
      this.greeting = "Good Afternoon";
    }
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
