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
    this.educatorService.createActivity({name: activity_name, description: activity_description, type: activity_type}).subscribe(data => {
      console.log(data);
      this.goBack();
    },
    err => { 
      console.log(err);
      return false;
    });
   }

   goBack(): void{
      this.location.back();
   }
}
