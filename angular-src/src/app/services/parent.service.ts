import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class ParentService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  getFamily(){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.get('http://localhost:8080/parents/family', {headers: headers})
      .map(res => res.json());
  }

  getCurrentActivities(room_id){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.post('http://localhost:8080/parents/currentactivities', {room_id: room_id}, {headers: headers})
      .map(res => res.json());
  }

  getActivityRecords(child_id){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.post('http://localhost:8080/parents/activityrecords', {child_id: child_id}, {headers: headers})
      .map(res => res.json());
  }

  commentOnChildActivityRecord(data){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.post('http://localhost:8080/parents/commentonchildactivityrecord', {data: data}, {headers: headers})
      .map(res => res.json());
  }

  storeFamily(family){
    localStorage.setItem('family', JSON.stringify(family));
  }

  loadFamily(){
    return localStorage.getItem('family');
  }

  loadToken(){
  	const token = localStorage.getItem('id_token');
  	this.authToken = token;
  }
}
