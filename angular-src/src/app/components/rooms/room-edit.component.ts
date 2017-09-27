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

    let rooms = JSON.parse(this.educatorService.loadRooms());
    if(rooms)
    {
      for(var i = 0; i < rooms.length; i++)
      {
        if(rooms[i].id == this.room_id)
        {
          this.room_name = rooms[i].room_name;
          this.room_description = rooms[i].room_description
        }
      }
    }
    else
    {
      this.educatorService.getRoomById(this.room_id)
        .subscribe(data => {
          data = data.data[0];
          this.room_name = data.room_name
          this.room_description = data.room_description
      }, 
        err => {
          console.log("Failed to load Room By ID" + err);
      });
    }
  }

  updateRoom() { 
    this.educatorService.updateRoom({name: this.room_name, description: this.room_description, id: this.room_id})
      .subscribe(data => {
        if(data.success)
        {
          console.log(data);
          this.goBack();
        }
      }, err => {console.log(err);
    });
  }
   
   goBack(): void{
      this.location.back();
   }
}
