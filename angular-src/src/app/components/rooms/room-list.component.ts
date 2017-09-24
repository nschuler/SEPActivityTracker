import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  Rooms = ["yolo", "yep"];
  constructor() { }

  ngOnInit() {
  }

  deleteRoom(room) {
  	var index = this.Rooms.indexOf(room);
    this.Rooms.splice(index, 1);
  }

}
