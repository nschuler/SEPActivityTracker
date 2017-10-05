import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';


@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms = [];
  assignedEducators = {};

  constructor(private educatorService: EducatorService) { }

  ngOnInit() {
    let rooms = JSON.parse(this.educatorService.loadRooms());
    if(rooms)
    {
      this.displayRooms(rooms.rooms,rooms.educators);
    }

    this.getAllRooms(); // Refresh from DB
  }

  getAllRooms() {
    this.educatorService.getRooms().subscribe(data => {
      if(data.success)
      {
        this.displayRooms(data.data.rooms, data.data.educators);
        this.educatorService.storeRooms(data.data);
      }
    }, err => {console.log(err);});
  }

  displayRooms(rooms,educators) {
    this.sortEducators(educators);

    this.rooms = []; // Clear existing array of rooms
    for (var i = 0; i < rooms.length; i++) {
      this.rooms.push(
        {
          'id' : rooms[i].id,
          'name' : rooms[i].room_name,
          'schedule_id' : rooms[i].schedule_id,
          'description' : rooms[i].room_description,
          'educator' : this.assignedEducators[parseInt(rooms[i].id)]
        });
    }
  }

  sortEducators(educators) {
    this.assignedEducators = {};
    for (var i=0; i<educators.length; i++) {
      if (educators[i].room_id != null) {
        if (!this.assignedEducators[educators[i].room_id]) {
          this.assignedEducators[educators[i].room_id] = [];
        }
        this.assignedEducators[educators[i].room_id].push(educators[i])
      }
    }
  }

  deleteRoom(room) {
    this.educatorService.deleteRoomById(room.id).subscribe(data => {
      if(data.success)
      {
        var index = this.rooms.indexOf(room);
        this.rooms.splice(index, 1);
      }
    }, 
    err => {
      console.log(err);
    });
  }

}
