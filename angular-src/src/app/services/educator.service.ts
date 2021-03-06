import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class EducatorService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  getProfile(){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.get('http://localhost:8080/educators/profile', {headers: headers})
      .map(res => res.json());
  }

  getSessionData(room_id, date) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/getsessiondata', {room_id: room_id, date: date}, {headers: headers})
      .map(res => res.json())
  }

  loadSessionData(room_id, session) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/getsessiondata', {room_id: room_id, session: JSON.stringify(session)}, {headers: headers})
      .map(res => res.json())
  }

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

  getEducators() {
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.get('http://localhost:8080/educators/all', {headers: headers})
      .map(res => res.json());
  }

  getChildrenInRoom(room_id) {
    this.loadToken(); // Grab auth token from local storage

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/childrenroom', {room_id: room_id}, {headers: headers})
      .map(res => res.json())
  };

  createRoom(room) {
    this.loadToken(); // Grab auth token from local storage

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/createroom', {room: room}, {headers: headers})
      .map(res => res.json())
  }

  addChildToRoom(room_id, child_id) {
    this.loadToken(); // Grab auth token from local storage

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/addchild', {room_id: room_id, child_id: child_id}, {headers: headers})
      .map(res => res.json())
  }

  removeChildFromRoom(child_id) {
    this.loadToken(); // Grab auth token from local storage

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/removechild', {child_id: child_id}, {headers: headers})
      .map(res => res.json())
  }

  loginToRoom(room_id) {
    this.loadToken(); // Grab auth token from local storage

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/logintoroom', {room_id: room_id}, {headers: headers})
      .map(res => res.json())
  }

  logoutOfRoom() {
    this.loadToken(); // Grab auth token from local storage

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.get('http://localhost:8080/educators/logoutofroom', {headers: headers})
      .map(res => res.json())
  }

  updateRoom(room) {
    this.loadToken(); // Grab auth token from local storage

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/updateroom', {room: room}, {headers: headers})
      .map(res => res.json())
  }

  getAllActivities() {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.get('http://localhost:8080/educators/allactivities', {headers: headers})
      .map(res => res.json())
  }

  getActivitiesByRoomId(room_id) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/activitiesbyroomid', {room_id: room_id}, {headers: headers})
      .map(res => res.json())
  }

  getTodaysActivitiesByRoomId(room_id, date) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/todaysactivitiesbyroomid', {room_id: room_id, date: date}, {headers: headers})
      .map(res => res.json())
  }

  getRoomById(room_id) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/roombyid', {room_id: room_id}, {headers: headers})
      .map(res => res.json())
  }

  deleteRoomById(room_id) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/deleteroom', {room_id: room_id}, {headers: headers})
      .map(res => res.json())
  }

  createActivity(activity) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/createactivity', {activity: activity}, {headers: headers})
      .map(res => res.json())
  }

  updateActivity(activity) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/updateactivity', {activity: activity}, {headers: headers})
      .map(res => res.json())
  }

  deleteActivity(activity_id) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/deleteactivity', {activity_id: activity_id}, {headers: headers})
      .map(res => res.json())
  }

  updateActivities(activities) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/updateactivities', {activities: activities}, {headers: headers})
      .map(res => res.json())
  }

  deleteActivityInstance(activity_instance_id) {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post('http://localhost:8080/educators/deleteactivityinstance', {activity_instance_id: activity_instance_id}, {headers: headers})
      .map(res => res.json())
  }

  getActivityTypes() {
    this.loadToken();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.get('http://localhost:8080/educators/getactivitytypes', {headers: headers})
      .map(res => res.json())
  }

  storeActivities(activities){
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  storeRooms(rooms){
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }

  loadActivities(){
    return localStorage.getItem('activities');
  }

  loadRooms(){
    return localStorage.getItem('rooms');
  }

  loadToken(){
  	const token = localStorage.getItem('id_token');
  	this.authToken = token;
  };
}
