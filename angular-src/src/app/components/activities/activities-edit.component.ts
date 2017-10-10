import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EducatorService } from '../../services/educator.service';
import { FlashMessagesService } from 'angular2-flash-messages';

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

  selected_activity_type: string;

  // Make this dynamically pulled from DB
  activityTypes = [];

  constructor(private route: ActivatedRoute, private location: Location, private educatorService: EducatorService, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.activity_id = +this.route.snapshot.params['activity'];

    this.educatorService.getActivityTypes().subscribe(data => {
      this.activityTypes = data.data;

      let activities = JSON.parse(this.educatorService.loadActivities());
      if(activities)
      {
        for(var i = 0; i < activities.length; i++)
        {
          if(activities[i].id == this.activity_id)
          {

            this.selected_activity_type = this.activityTypes[activities[i].type - 1].name
            this.activity_name = activities[i].name;
            this.activity_description = activities[i].description;
          }
        }
      }
      else
      {
        // TODO get activity from db
      }
    }, err => {console.log(err);});
  }

  updateActivity(activity_type:string) { 
    this.educatorService.updateActivity({name: this.activity_name, type: activity_type, description: this.activity_description, id: this.activity_id})
      .subscribe(data => {
        if(data.success)
        {
          this.flashMessage.show('Activity ' + this.activity_id + ' was updated!', {cssClass:'alert-success', timeout:2000});
          this.goBack();
        } else {
          this.flashMessage.show(data.msg, {cssClass:'alert-danger', timeout:5000});
        }
      }, err => {
        console.log(err);
      });
  }
   
   goBack(): void{
      this.location.back();
   }
}
