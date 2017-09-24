import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css']
})
export class ActivitiesListComponent implements OnInit {
  activities = [];
  
  constructor(private educatorService: EducatorService) { }

  ngOnInit() {
    this.getAllActivities();
  }

  getAllActivities() {
    this.educatorService.getAllActivities().subscribe(data => {
      let activityData = data.data.activityData
      console.log(activityData);
      for (var i = 0; i < activityData.length; i++) {
        this.activities.push(
          {
            'id' : activityData[i].id,
            'type' : activityData[i].type,
            'name' : activityData[i].name,
            'description' : activityData[i].description
          });
      }
    }, err => {console.log(err);});
  }

  deleteActivity(activity) {
  	var index = this.activities.indexOf(activity);
    this.activities.splice(index, 1);

    // NEED TO CODE FUNCTION TO DELETE FROM DB
  }
}
