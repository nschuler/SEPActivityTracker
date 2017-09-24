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

  getTimetable(){
    let headers = new Headers();
    this.loadToken(); // Grab auth token from local storage

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.get('http://localhost:8080/parents/timetable', {headers: headers})
      .map(res => res.json());
  }

  loadToken(){
  	const token = localStorage.getItem('id_token');
  	this.authToken = token;
  }
}