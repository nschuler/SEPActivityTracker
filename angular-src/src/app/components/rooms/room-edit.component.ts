import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent implements OnInit {
  room_id: number; // Identifies which room has been selected
  room_name: string;
  room_description: string;


  constructor(private route: ActivatedRoute, private location: Location, private educatorService: EducatorService) { }

  ngOnInit() {
    this.room_id = +this.route.snapshot.params['room'];
    this.room_name = "HELLOO";
    this.educatorService.getRoomById(this.room_id)
      .subscribe(data => {
        console.log(data);
      }, err => {console.log(err);
    });
  }

  updateRoom() { 
    this.educatorService.updateRoom({name: this.room_name, description: this.room_description, id: this.room_id})
      .subscribe(data => {
        console.log(data);
      }, err => {console.log(err);
    });
  }
   
   goBack(): void{
        this.location.back();
   }
}
