import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule } from '@angular/material';
import { Location } from '@angular/common';


@Component({
  selector: 'app-activities-create',
  templateUrl: './activities-create.component.html',
  styleUrls: ['./activities-create.component.css']
})
export class ActivitiesCreateComponent implements OnInit {
  activityCreated:boolean = false;

  // Make this dynamically pulled from DB
  activityTypes = [{id:1, name: "care"}, {id:2, name: "learning"}, {id:1, name: "leisure"}];

  constructor(private educatorService: EducatorService, private location: Location) { }

  ngOnInit() {
  }

  newActivity(activity_name:string, activity_description:string, activity_type:string){
    // EXAMPLE
    // activity is made up of:
    // 1. name
    // 2. description
    // 3. type

    // this.educatorService.createActivity({name: activity_name, description: activity_description, type: activity_type}).subscribe(data => {
    //   console.log(data);
    // },
    // err => { 
    //   console.log(err);
    //   return false;
    // });

    console.log("activity name - ", activity_name);
   }

   goBack(): void{
      this.location.back();
   }
}
