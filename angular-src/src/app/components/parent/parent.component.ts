import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ParentService } from '../../services/parent.service';
import { EducatorService } from '../../services/educator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  childno: number ;
  children: any[] = [];
  tempOfThree: Child[] = [];
  tempNumb: number = 0;
  constructor(private authService: AuthService, private parentService: ParentService, private educatorService: EducatorService, private router: Router) { }

  ngOnInit() {

    this.parentService.getFamily().subscribe(data => {
     this.childno = data.family.children.length;
     //make some kids

      for(let i in data.family.children){
        if(this.tempNumb > 3){
          this.tempNumb =0;
          this.children.push(this.tempOfThree);
          this.tempOfThree = [];
        }
      this.tempOfThree.push(new Child(data.family.children[i].first_name , data.family.familyName, data.family.children[i].dob, data.family.address, data.family.children[i].family_id, data.family.children[i].id, data.family.children[i].room_id));
        this.tempNumb ++;
    }


     //stop making kids
    },
    err => {
      console.log(err);
      return false;
    });
    /////\\
    //\\\\\\
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

  constructor(firstname: string, familyName: string, dob: string, address: string, famId: string, childId: string, roomId: string ) {
    this.firstName = firstname;
    this.familyName = familyName;
    this.dob = dob;
    this.address =  address;
    this.childId = childId;
    this.roomId = roomId;

  }

  sendName (){
    return this.firstName + " " + this.familyName;
  }
  display(){
    //ParentComponent.testingBoy = '<div class="footerShell">{{firstName}}</div>';

  }
}
