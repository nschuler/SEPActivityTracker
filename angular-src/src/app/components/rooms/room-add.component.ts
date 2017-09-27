import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule } from '@angular/material';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrls: ['./room-add.component.css']
})
export class RoomAddComponent implements OnInit {
  roomCreated:boolean = false;

  constructor(private route: ActivatedRoute,private location: Location) { }

  ngOnInit() {
  }

  newRoom(room_name:string, room_description:string, birthDate:Date){
        console.log(room_name);
   }

   goBack(): void{
        this.location.back();
   }


}
