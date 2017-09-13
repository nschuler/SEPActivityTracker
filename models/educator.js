const bcrypt = require('bcryptjs');
const config = require('../config/database');
const dateformat = require('dateformat');
var mysql_query = require('../connection');

var EDUCATOR = 2;

module.exports.getChildren = function(id, callback) {
	this.validateEducator(id, (err, valid) => { 
		if(err) callback(err, null);
		if(valid)
		{
			mysql_query('SELECT * FROM Child', (err, children)=>{
				if(err) callback(err, null);
				callback(err, children);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null)
		}
	});
}

module.exports.getChildrenInRoom = function(id, room_name, callback) {
	this.validateEducator(id, (err, valid) => { 
		if(err) callback(err, null);
		if(valid)
		{
			this.getRoomID(room_name, (err, room_id) => {
				if (err) callback(err, null);
				this.fetchChildrenFromDB(room_id[0].id, (err, children) => {
					if (err) callback(err, null);
					callback(err, children)
				});
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null)
		}
	});
}

module.exports.fetchChildrenFromDB = function(room_id, callback) {
	mysql_query('SELECT * FROM Child WHERE room_id = ?', room_id, (err, data) => {
		if (data) 
		{
			callback(err, data);
		}
		else
		{
			callback(err, null);
		}
	});
}

module.exports.getRoomID = function(room_name, callback) {
	mysql_query('SELECT id FROM Room WHERE room_name = ?', room_name, (err, data) => {
		if (data) 
		{
			callback(err, data);
		}
		else
		{
			callback(err, null);
		}
	});
}


module.exports.validateEducator = function(id, callback) {
	mysql_query('SELECT role_type FROM Role WHERE id = ?', id, (err, data) => {
		if(data[0].role_type == EDUCATOR)
		{
			callback(err, true);
		}
		else
		{
			callback(err, false);
		}
	});
}