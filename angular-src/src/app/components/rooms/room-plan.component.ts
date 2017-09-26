import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MnFullpageOptions, MnFullpageService } from 'ngx-fullpage';
import { EducatorService } from '../../services/educator.service';



@Component({
  selector: 'app-room-plan',
  templateUrl: './room-plan.component.html',
  styleUrls: ['./room-plan.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomPlanComponent implements OnInit {
	room_id: number; // Identifies which room has been selected
	enrolledChildren = [];
	allChildren = [];


  public options: MnFullpageOptions = new MnFullpageOptions({
        controlArrows: false,
        scrollingSpeed: 1000,

        menu: '.menu',
        css3: true,
        anchors: [
            'mainpage', 'children', 'activites', 'temp'
        ]
    });


  constructor(private route: ActivatedRoute, private location: Location, public fullpageService: MnFullpageService, private educatorService: EducatorService
	) { }

  ngOnInit() {
  this.room_id = +this.route.snapshot.params['room'];

  	this.educatorService.getChildrenInRoom(this.room_id).subscribe(data => {
      this.enrolledChildren = data.children;
    }, err => {console.log(err);});
  }

  getAllChildren() {
    this.educatorService.getChildren().subscribe(data => {
      for (var i = 0; i < data.children.length; i++) {
        this.allChildren.push(
          {
            'id' : data.children[i].id,
            'name' : data.children[i].id + ". " + data.children[i].first_name + " " + data.children[i].last_name
          });
      }
    }, err => {console.log(err);});
  }

}
