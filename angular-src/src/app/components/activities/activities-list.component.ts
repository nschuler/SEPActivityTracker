import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css']
})
export class ActivitiesListComponent implements OnInit {
  Activities = ["yolo", "yep"];
  constructor() { }

  ngOnInit() {
  }

  deleteActivity(activity) {
  	var index = this.Activities.indexOf(activity);
    this.Activities.splice(index, 1);
  }
}
