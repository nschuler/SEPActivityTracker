import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';


@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms = [];

  constructor(private educatorService: EducatorService) { }

  ngOnInit() {
    this.getAllRooms();    
  }

  getAllRooms() {
    this.educatorService.getRooms().subscribe(data => {
      let roomData = data.data
      for (var i = 0; i < roomData.length; i++) {
        this.rooms.push(
          {
            'id' : roomData[i].id,
            'name' : roomData[i].room_name,
            'schedule_id' : roomData[i].schedule_id,
            'description' : roomData[i].room_description
          });
      }
    }, err => {console.log(err);});
  }

  deleteRoom(room) {
  	var index = this.rooms.indexOf(room);
    this.rooms.splice(index, 1);
  }

}
