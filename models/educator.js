const bcrypt = require('bcryptjs');
const config = require('../config/database');
const dateformat = require('dateformat');
var mysql_query = require('../connection');

var EDUCATOR = 2;

module.exports.getEducators = function(user, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT User.first_name, User.last_name, Educator.id, Educator.room_id FROM Educator INNER JOIN User ON Educator.id = User.id', (err, educator)=>{
				if(err) callback(err, null);
				callback(err, educator);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.getChildren = function(user, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM Child', (err, children)=>{
				if(err) callback(err, null);
				callback(err, children);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.getRooms = function(user, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT User.first_name, User.last_name, Educator.id, Educator.room_id FROM Educator INNER JOIN User ON Educator.id = User.id', (err, educators)=>{
				if(err) callback(err, null);

				mysql_query('SELECT * FROM Room', (err, rooms) => { 
					let data = {
						educators: educators,
						rooms: rooms,
					}
					callback(err, data);
				});
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.getChildrenInRoom = function(user, room_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			this.fetchChildrenFromDB(room_id, (err, children) => {
				if (err) callback(err, null);
				callback(err, children);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.updateRoom = function(user, room, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('UPDATE Room Set room_name = ?, room_description = ? WHERE id = ?',[room.name, room.description, room.id],(err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.getAllActivities = function(user, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM Activity', callback);
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.getRoomById = function(user, room_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM Room WHERE id = ?', room_id, (err, roomData) => { 
				callback(err, roomData);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'), null);
		}
	});
}

module.exports.createActivity = function(user, data, callback){
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			let activity = {
				type: data.type,
				name: data.name,
				description: data.description
			}

			mysql_query('INSERT INTO Activity SET ?', activity, callback);
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.updateActivity = function(user, activity, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('UPDATE Activity SET type = ?, name = ?, description = ? WHERE id = ?',[activity.type, activity.name, activity.description, activity.id],(err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.deleteActivity = function(user, activity_id, callback){
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('DELETE FROM Activity WHERE id = ?', activity_id, (err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.getActivityTypes = function(user, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM ActivityType', (err, data) => { 
				console.log(data);
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
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

module.exports.deleteRoomByID = function(user, room_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('DELETE FROM Room WHERE id = ?', room_id, (err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'), null);
		}
	});
}

module.exports.createRoom = function(user, roomData, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			let room = {
				room_name: roomData.name,
				room_description: roomData.description
			}

			mysql_query('INSERT INTO Room SET ?', room, callback);
		}
		else
		{
			callback(new Error('User is not an Educator'), null);
		}
	});
}

module.exports.getActivitiesByRoomId = function(user, room_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM Schedule WHERE room_id = ?', room_id, callback);
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.createActivityInstance = function(user, activity, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			let activityInstance = {
				room_id: activity.room_id,
				activity_id: activity.activity_id,
				start_time: activity.start_time,
				end_time: activity.end_time,
				length: activity.length,
				sunday: activity.sunday,
				monday: activity.monday,
				tuesday: activity.tuesday,
				wednesday: activity.wednesday,
				thursday: activity.thursday,
				friday: activity.friday,
				saturday: activity.saturday,
			}

			mysql_query('INSERT INTO Schedule SET ?', activityInstance,(err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.deleteActivityInstance = function(user, activity_instance_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('DELETE FROM Schedule WHERE id = ?', activity_instance_id, (err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.updateActivityInstance = function(user, activity, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('UPDATE Schedule SET activity_id = ?, start_time = ?, end_time = ?,'+
				' length = ?, sunday = ?, monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ?, saturday = ? WHERE id = ?',[activity.activity_id, activity.start_time, activity.end_time, activity.length, activity.sunday, activity.monday, activity.tuesday, activity.wednesday, activity.thursday, activity.friday, activity.saturday, activity.id],(err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.validateEducator = function(role_type, callback) {
	if(role_type === EDUCATOR)
	{
		callback(true);
	} 
	else
	{
		callback(false);
	}
}