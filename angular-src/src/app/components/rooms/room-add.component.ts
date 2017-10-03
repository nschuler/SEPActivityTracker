import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule } from '@angular/material';
import { Location } from '@angular/common';
import { EducatorService } from '../../services/educator.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrls: ['./room-add.component.css']
})
export class RoomAddComponent implements OnInit {
  roomCreated:boolean = false;

  constructor(private educatorService: EducatorService, private route: ActivatedRoute, private location: Location, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  newRoom(room_name:string, room_description:string){
    this.educatorService.createRoom({name: room_name, description: room_description}).subscribe(data => {
      if(data.success)
      {
        this.flashMessage.show('A new room was created!', {cssClass:'alert-success', timeout:5000});
        this.goBack();
      } else {
        this.flashMessage.show(data.msg, {cssClass:'alert-danger', timeout:5000});
      }}, 
      err => {
        console.log(err);
    });
   }

   goBack(): void{
      this.location.back();
   }
}