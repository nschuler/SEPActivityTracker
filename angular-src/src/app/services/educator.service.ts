import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class EducatorService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  getRooms(){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.get('http://localhost:8080/educators/rooms', {headers: headers})
      .map(res => res.json());
  };

  getChildren(){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.get('http://localhost:8080/educators/allchildren', {headers: headers})
      .map(res => res.json());
  };

  getChildrenInRoom(room_name) {
    this.loadToken(); // Grab auth token from local storage

    var bodyString = JSON.stringify({
        room_name: room_name
    });

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/childrenroom', bodyString, {headers: headers})
      .map(res => res.json())
  };

  getAllActivities() {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.get('http://localhost:8080/educators/allactivities', {headers: headers})
      .map(res => res.json())
  }

  getActivitiesById(room_id) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/activitiesbyid', {room_id: room_id}, {headers: headers})
      .map(res => res.json())
  }

  loadToken(){
  	const token = localStorage.getItem('id_token');
  	this.authToken = token;
  };
}
