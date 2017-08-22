const bcrypt = require('bcryptjs');
const config = require('../config/database');
const dateformat = require('dateformat');
var mysql_query = require('../connection');


function User(name, email, username, password) {
	this.name = name,
	this.email = email,
	this.username = username,
	this.password = password
}

module.exports = User;

module.exports.getUserById = function(id, callback) {
	mysql_query('SELECT * FROM users WHERE id = ?', id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	mysql_query('SELECT * FROM users WHERE username = ?', username, callback);
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
				name: newUser.name,
				username: newUser.username,
				password: newUser.password,
				person_id: 12,
				status: 'TEST',
				created_at: date,
				last_updated_at: date,
				email: newUser.email
			};
			mysql_query('INSERT INTO users SET ?', user, callback);
		});
	}); 
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		callback(null, isMatch);
	});
}

