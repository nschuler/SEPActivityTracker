import { Component, OnInit, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabsModule, MdButtonModule, MdGridListModule } from '@angular/material';
import { Http } from '@angular/http';
import { FlashMessagesService } from 'angular2-flash-messages';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  spaceScreens: Array<any>;
  roomsArray = [];


  constructor(
    private http: Http, 
    private flashMessage: FlashMessagesService
    ){}


  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    for (var i = 0; i < 5; i++) {
      this.roomsArray.push(
        {
          'title':"Room ID: "+ i,
          'content': "The data you are seeing here is for the room with room ID: " + i
        });
    }
  }

  removeRoom(room) {
    var index = this.roomsArray.indexOf(room);
    this.roomsArray.splice(index, 1);
  }

  addRoom(title, description) {
    var view = description || title + " Content View";
    this.roomsArray.push({ title: title, content: view, disabled: false });
  }

  onSelectChange($event: any) {
    console.log('event => ', $event.tab.textLabel);
    console.log('index => ', this.roomsArray[$event.index].content);
    this.roomsArray[$event.index].content = "YOLO : " + $event.index;
  }
}