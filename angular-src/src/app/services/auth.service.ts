import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  registerUser(user){
  	let headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('http://localhost:8080/users/register', user, {headers: headers})
  	  .map(res => res.json());
  }

  authenticateUser(user){
  	let headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('http://localhost:8080/users/authenticate', user, {headers: headers})
  	  .map(res => res.json());
  }

  getProfile(){
	  let headers = new Headers();
	  this.loadToken(); // Grab auth token from local storage

  	headers.append('Content-Type', 'application/json');
  	headers.append('Authorization', this.authToken);
  	return this.http.get('http://localhost:8080/users/profile', {headers: headers})
  	  .map(res => res.json());
  }

  storeUserData(token, user){
  	localStorage.setItem('id_token', token); // we use id_token as JWT authentication auto checks for this in storage
  	localStorage.setItem('user', JSON.stringify(user));
  	this.authToken = token;
  	this.user = user;
  }

  loadUserData(){
    return localStorage.getItem('user');
  }

  loadToken(){
  	const token = localStorage.getItem('id_token');
  	this.authToken = token;
  }

  storeProfile(profile){
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  loadProfile(){
    return localStorage.getItem('user');
  }

  loggedIn(){
  	return tokenNotExpired('id_token');
  }

  educatorLoggedIn(){
    return (tokenNotExpired('id_token') && JSON.parse(this.loadProfile()).role_type == '2');
  }

  logout(){
  	this.authToken = null;
  	this.user = null;
  	localStorage.clear();
  }
}
