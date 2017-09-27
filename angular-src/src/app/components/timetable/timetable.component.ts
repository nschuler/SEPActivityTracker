import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ParentService } from '../../services/parent.service';
import { EducatorService } from '../../services/educator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  constructor(private authService: AuthService, private parentService: ParentService, private educatorService: EducatorService, private router: Router) { }

  ngOnInit() {
    //get Id from below!
    console.log(this.parseURLParams(window.location.search));


  	this.parentService.getTimetable().subscribe(data => {
  	//	console.log(data.msg);
  	},
  	err => {
  	//	console.log(err);
  		return false;
  	});

    this.parentService.getFamily().subscribe(data => {
      //console.log(data);
    },
    err => {
     // console.log(err);
      return false;
    });

    this.educatorService.getChildren().subscribe(data => {
      //console.log(data);
    },
    err => {
      //console.log(err);
      return false;
    });
  }
  //stolen from https://stackoverflow.com/questions/814613/how-to-read-get-data-from-a-url-using-javascript
  parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
}
