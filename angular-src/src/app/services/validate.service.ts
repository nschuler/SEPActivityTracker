import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
  	if(user.first_name == undefined || user.last_name == undefined || user.email == undefined || user.username == undefined || user.password == undefined){
      return false;
    } else if (user.first_name.length < 1 || user.last_name.length < 1 || user.email.length < 1 || user.username.length < 1 || user.password.length < 1) {
      return false;
  	} else {
  		return true;
  	}
  }

  validateEmail(email){
  	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
  }
}
