import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-activities-edit',
  templateUrl: './activities-edit.component.html',
  styleUrls: ['./activities-edit.component.css']
})
export class ActivitiesEditComponent implements OnInit {

  constructor(private educatorService: EducatorService) { }

  ngOnInit() {
   // EXAMPLE - 
   // Very similar to createActivity, except you also pass in the id of the activity you want to update.

   // this.educatorService.updateActivity({name: "Reading Time", description: "Story time", type: "Learning", id: "1"}).subscribe(data => {
   //    console.log(data);
   //  },
   //  err => { 
   //    console.log(err);
   //    return false;
   //  });
  }

}
