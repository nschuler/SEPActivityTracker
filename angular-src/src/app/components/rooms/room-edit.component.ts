import { Component, OnInit } from '@angular/core';
import { EducatorService } from '../../services/educator.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent implements OnInit {

  constructor(private educatorService: EducatorService) { }

  ngOnInit() {
  	// EXAMPLE
  	// this.educatorService.updateRoom({name: "Opal Room", description: "New Description here", id: 3}).subscribe(data => {
	  //     console.log(data);
	  //   }, err => {console.log(err);
   //  });
  }
}
