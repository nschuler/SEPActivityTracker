import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css']
})
export class ActivitiesListComponent implements OnInit {
  activityTypes = {};
  activities = [];
  
  constructor(private educatorService: EducatorService) { }

  ngOnInit() {
    let activities = JSON.parse(this.educatorService.loadActivities());
    if(activities)
      this.displayActivities(activities);

    this.getAllActivities(); // Refresh from DB
    this.activityTypes[1] = "Care";
    this.activityTypes[2] = "Learning";
    this.activityTypes[3] = "Leisure";
  }

  getAllActivities() {
    this.educatorService.getAllActivities().subscribe(data => {
      if(data.success)
      {
        let activityData = data.data.activityData
        this.educatorService.storeActivities(activityData);
        this.displayActivities(activityData);
      }
    }, err => {console.log(err);});
  }

  displayActivities(activities) {
    this.activities = []; // Clear existing array of activities
    for (var i = 0; i < activities.length; i++) {
      this.activities.push(
        {
          'id' : activities[i].id,
          'type' : this.activityTypes[activities[i].type],
          'name' : activities[i].name,
          'description' : activities[i].description
        });
    }
  }

  deleteActivity(activity) {
    this.educatorService.deleteActivity(activity.id).subscribe(data => {
      if(data.success)
      {
        var index = this.activities.indexOf(activity);
        this.activities.splice(index, 1);
      }
    }, err => {
      console.log(err);
    });
  }
}
