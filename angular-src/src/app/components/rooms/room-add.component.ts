import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule } from '@angular/material';
import { Location } from '@angular/common';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrls: ['./room-add.component.css']
})
export class RoomAddComponent implements OnInit {
  roomCreated:boolean = false;

  constructor(private educatorService: EducatorService, private route: ActivatedRoute,private location: Location) { }

  ngOnInit() {
  }

  newRoom(room_name:string, room_description:string){
    this.educatorService.createRoom({name: room_name, description: room_description}).subscribe(data => {
      if(data.success)
      {
        this.goBack();
      }}, 
      err => {
        console.log(err);
    });
   }

   goBack(): void{
      this.location.back();
   }
}