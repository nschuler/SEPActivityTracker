import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
  	if(user.name == undefined || user.email == undefined || user.username == undefined || user.password == undefined){
  		return false;
    } else if (user.name.length < 1 || user.email.length < 1 || user.username.length < 1 || user.password.length < 1) {
      return false;
  	} else {
      console.log(user.username);
  		return true;
  	}
  }

  validateEmail(email){
  	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
  }
}
