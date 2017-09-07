const bcrypt = require('bcryptjs');
const config = require('../config/database');
const dateformat = require('dateformat');
var mysql_query = require('../connection');


function User(username, password, first_name, last_name, email, mobile, dob) {
	this.username = username,
	this.password = password,
	this.first_name = first_name,
	this.last_name = last_name,
	this.email = email,
	this.mobile = mobile,
	this.dob = dob
}

module.exports = User;

module.exports.getUserById = function(id, callback) {
	mysql_query('SELECT * FROM User WHERE id = ?', id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	mysql_query('SELECT * FROM User WHERE username = ?', username, callback);
}

module.exports.addUser = function(newUser, callback) {

	// Generate a salt for the password of 10 rounds
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if(err) throw err;
			newUser.password = hash;

			let now = new Date();
			date = dateformat(now, 'yyyy-mm-dd HH:MM:ss');

			let user = {
				username: newUser.username,
				password: newUser.password,
				first_name: newUser.first_name,
				last_name: newUser.last_name,
				email: newUser.email,
				mobile: newUser.mobile,
				dob: newUser.dob,
				created_at: date,
				last_updated_at: date,
			};
			mysql_query('INSERT INTO User SET ?', user, callback);
		});
	}); 
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		callback(null, isMatch);
	});
}

