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
    let rooms = JSON.parse(this.educatorService.loadRooms());
    if(rooms)
      this.displayRooms(rooms);

    this.getAllRooms(); // Refresh from DB
  }

  getAllRooms() {
    this.educatorService.getRooms().subscribe(data => {
      if(data.success)
      {
        let roomData = data.data
        this.educatorService.storeRooms(roomData);
        this.displayRooms(roomData);
      }
    }, err => {console.log(err);});
  }

  displayRooms(rooms) {
    this.rooms = []; // Clear existing array of rooms
    for (var i = 0; i < rooms.length; i++) {
      this.rooms.push(
        {
          'id' : rooms[i].id,
          'name' : rooms[i].room_name,
          'schedule_id' : rooms[i].schedule_id,
          'description' : rooms[i].room_description
        });
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
