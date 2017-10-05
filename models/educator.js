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
			mysql_query('SELECT * FROM Room', (err, rooms) => { 
				callback(err, rooms);
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
			mysql_query('SELECT * FROM Activity', (err, activityData) => { 
				let queryData = [];
				for (i in activityData) {
					queryData.push(activityData[i].id);
				}

				query = 'SELECT * FROM ActivityMeta WHERE activity_id = '.concat(queryData.join(" OR activity_id ="));

				mysql_query(query, (err, activityMetaData) => { 
					let data = {
						activityData: activityData,
						activityMetaData: activityMetaData,
					}; 

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

module.exports.getActivitiesByRoomId = function(user, room_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM Activity WHERE room_id = ?', room_id, (err, activityData) => { 
				let queryData = [];
				for (i in activityData) {
					queryData.push(activityData[i].id);
				}

				query = 'SELECT * FROM ActivityMeta WHERE activity_id = '.concat(queryData.join(" OR activity_id ="));

				mysql_query(query, (err, activityMetaData) => { 

					let data = {
						activityData: activityData,
						activityMetaData: activityMetaData,
					}; 

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