import { Component, OnInit, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabsModule } from '@angular/material';
import { Http } from '@angular/http';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  spaceScreens: Array<any>;

  constructor(private http: Http) {
    // this.http.get('http://localhost/Delivery__Manager/data.json')
    //   .map(response => response.json().screenshots)
    //   .subscribe(res => this.spaceScreens = res);
  }


  ngOnInit() {
  }

  getDataObservable() {
    this.http.get('./data.json')
      .subscribe(resp => {
        console.log(resp);
      });
    console.log('OKAY');
  }
}