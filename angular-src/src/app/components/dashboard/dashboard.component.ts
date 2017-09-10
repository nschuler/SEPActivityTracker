import { Component, OnInit, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabsModule, MdButtonModule, MdGridListModule, MdAutocompleteModule } from '@angular/material';
import {FormControl} from '@angular/forms';
import { Http } from '@angular/http';
import { FlashMessagesService } from 'angular2-flash-messages';


import 'rxjs/add/operator/startWith';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  spaceScreens: Array<any>;
  roomsArray = [];


  childrenCtrl: FormControl;
  filteredChildren: any;

  allChildren = [
    'Corey Stidston',
    'Nicholas Schuler',
    'Alan Bootheeeee',
    'Chris Kerdad',
    'Isaac the Rich Man',
    'Tex the bad Handshaker'
  ];

  constructor(
    private http: Http, 
    private flashMessage: FlashMessagesService
    ){
    this.childrenCtrl = new FormControl();
    this.filteredChildren = this.childrenCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterChildren(name));
  }


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

  filterChildren(val: string) {
    return val ? this.allChildren.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : this.allChildren;
  }
}