import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-activities-edit',
  templateUrl: './activities-edit.component.html',
  styleUrls: ['./activities-edit.component.css']
})
export class ActivitiesEditComponent implements OnInit {
  activity_id: number; // Identifies which room has been selected
  activity_type: string;
  activity_name: string;
  activity_description: string;

  // Make this dynamically pulled from DB
  activityTypes = [{id:1, name: "Care"}, {id:2, name: "Learning"}, {id:3, name: "Leisure"}];

  constructor(private route: ActivatedRoute, private location: Location, private educatorService: EducatorService) { }

  ngOnInit() {
    this.activity_id = +this.route.snapshot.params['activity'];

    let activities = JSON.parse(this.educatorService.loadActivities());
    if(activities)
    {
      for(var i = 0; i < activities.length; i++)
      {
        if(activities[i].id == this.activity_id)
        {
          this.activity_type = activities[i].type;
          this.activity_name = activities[i].name;
          this.activity_description = activities[i].description;
        }
      }
    }
    else
    {
      // TODO get activity from db
    }
  }

  updateActivity() { 
    this.educatorService.updateActivity({name: this.activity_name, type: this.activity_type, description: this.activity_description, id: this.activity_id})
      .subscribe(data => {
        if(data.success)
        {
          console.log(this.activity_type);
          //TODO Flash messages
          this.goBack();
        }
      }, err => {console.log(err);
    });
  }
   
   goBack(): void{
      this.location.back();
   }
}
