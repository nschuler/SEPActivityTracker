import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule } from '@angular/material';
import { Location } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-activities-create',
  templateUrl: './activities-create.component.html',
  styleUrls: ['./activities-create.component.css']
})
export class ActivitiesCreateComponent implements OnInit {
  activityCreated:boolean = false;

  // Make this dynamically pulled from DB
  activityTypes = [{id:1, name: "Care"}, {id:2, name: "Learning"}, {id:1, name: "Leisure"}];

  constructor(private educatorService: EducatorService, private location: Location, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  newActivity(activity_name:string, activity_description:string, activity_type:string){
    this.educatorService.createActivity({name: activity_name, description: activity_description, type: activity_type}).subscribe(data => {
      if(data.success)
      {
        this.flashMessage.show('A new activity was created!', {cssClass:'alert-success', timeout:5000});
        this.goBack();
      } else {
        this.flashMessage.show(data.msg, {cssClass:'alert-danger', timeout:5000});
      }
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
