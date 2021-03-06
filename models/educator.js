const bcrypt = require('bcryptjs');
const config = require('../config/database');
const dateformat = require('dateformat');
var mysql_query = require('../connection');

var EDUCATOR = 2;

module.exports.getProfile = function(user, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM Educator WHERE id = ?', user.id, (err, educator)=>{
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

module.exports.getSessionData = function(user, room_id, date, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			callback(new Error('incomplete'), null);
			// mysql_query('SELECT * FROM Session WHERE id = ?', room_id, (err,data) => {
			// 	if(err) callback(err,null);

			// 	if(data[0].date == date)
			// 	{
			// 		callback(err,data);
			// 	}
			// 	else
			// 	{
			// 		mysql_query('UPDATE Session SET date = ?, session = ? WHERE id = ?',[date,'{"session":[]}', room_id], (err,data) => {
			// 			callback(err,"No session data");
			// 		});
			// 	}
			// });
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.loadSessionData = function(user, room_id, session, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			callback(new Error('incomplete'), null);
			// mysql_query('UPDATE Session SET session = ? WHERE id = ?',[session, room_id], (err,data) => {
			// 	if(err) throw err;
			// 	callback(err,data);
			// });
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

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
			mysql_query('SELECT * FROM Child WHERE room_id = ?', room_id, (err, data) => {
				if(err) throw err;
				callback(err,data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.addChildToRoom = function(user, room_id, child_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('UPDATE Child Set room_id = ? WHERE id = ?',[room_id, child_id], (err,data) => {
				callback(err,data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
		}
	});
}

module.exports.removeChildFromRoom = function(user, child_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('UPDATE Child Set room_id = ? WHERE id = ?',[null, child_id], (err,data) => {
				callback(err,data);
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

module.exports.loginToRoom = function(user, room_id, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('UPDATE Educator Set room_id = ? WHERE id = ?', [room_id, user.id], (err, data) => { 
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'), null);
		}
	});
}

module.exports.logoutOfRoom = function(user, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('UPDATE Educator Set room_id = ? WHERE id = ?', [null, user.id], (err, data) => { 
				callback(err, data);
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
				callback(err, data);
			});
		}
		else
		{
			callback(new Error('User is not an Educator'),null);
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

module.exports.getTodaysActivitiesByRoomId = function(user, room_id, date_data, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			// mysql_query('SELECT * FROM Schedule WHERE room_id = ?', room_id, callback);
			mysql_query('SELECT * FROM Schedule INNER JOIN Activity ON Schedule.activity_id = Activity.id WHERE Schedule.room_id = ?', room_id, (err, schedule) => { 
				if(err) callback(err, null);
				let date = new Date(date_data);
				let startDate;
				let endDate;
				let temp;

				activityArray = [];

				for(i in schedule)
				{
					temp = schedule[i].start_time.indexOf("GMT");
					startDate = new Date(schedule[i].start_time.slice(0,temp));
					temp = schedule[i].end_time.indexOf("GMT");
					endDate = new Date(schedule[i].end_time.slice(0,temp));

					if(startDate.getDate() == date.getDate() && startDate.getMonth() == date.getMonth() && startDate.getYear() == date.getYear())
					{
						activityArray.push({
							start_time: startDate.getHours() + ":" + ((startDate.getMinutes() < 10) ? "0" + startDate.getMinutes() : startDate.getMinutes()) + ((startDate.getHours() < 12) ? "AM" : "PM"),
							end_time: endDate.getHours() + ":" + ((endDate.getMinutes() < 10) ? "0" + endDate.getMinutes() : endDate.getMinutes()) + ((endDate.getHours() < 12) ? "AM" : "PM"),
							type: schedule[i].type,
							name: schedule[i].name,
							description: schedule[i].description
						});
					}
				}

				callback(err, activityArray);
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

module.exports.updateActivities = function(user, activities, callback) {
	this.validateEducator(user.role_type, (valid) => { 
		if(valid)
		{
			let failed = false
			for (var i = 0, len = activities.length; i < len; i++) {
				// If the activity already has a ID in the schedule table - NOT A NEW ACTIVITY TO THE SCHEDULE - UPDATE IT
				if (activities[i].activity_schedule_id != null) {
					mysql_query('UPDATE Schedule SET activity_id = ?, start_time = ?, end_time = ?,'+
						' length = ?, sunday = ?, monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ?, saturday = ? WHERE id = ?',[activities[i].activity_title_id, activities[i].start_string, activities[i].end_string, 0, 0, 0, 0, 0, 0, 0, 0, activities[i].activity_schedule_id], (err, data) => { 
							if (err) failed= true;
						});
				} else { // Its a new activity to the schedule, so we insert it
					let activityInstance = {
						room_id: activities[i].room_id,
						activity_id: activities[i].activity_title_id,
						start_time: activities[i].start_string,
						end_time: activities[i].end_string,
						length: 0,
						sunday: 0,
						monday: 0,
						tuesday: 0,
						wednesday: 0,
						thursday: 0,
						friday: 0,
						saturday: 0,
					}

					mysql_query('INSERT INTO Schedule SET ?', activityInstance,(err, data) => { 
						if (err) failed= true;
					});
				}
			}

			if (!failed) {
				callback(null, "Activity Update/Insert was Succesasful");
			} else {
				callback(new Error('Failed to Update Actviities Schedule'), null);
			}
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