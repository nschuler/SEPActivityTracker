const bcrypt = require('bcryptjs');
const config = require('../config/database');
const dateformat = require('dateformat');
var mysql_query = require('../connection');

var PARENT = 1;

module.exports.getFamily = function(user, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT family_id FROM FamilyMember WHERE id = ?', user.id, (err, familyMember) => { 
				if(err) callback(err, null);

				mysql_query('SELECT * FROM Family WHERE id = ?', familyMember[0].family_id, (err, family) => {
					if(err) callback(err, null);

					mysql_query('SELECT * FROM Child WHERE family_id = ?', family[0].id, (err, children) => {

						let familyData = {
							familyName: family[0].family_name,
							address: family[0].address,
							children: children
						};

						callback(err, familyData);
					});
				});
			});
		}
		else
		{
			callback(new Error('User is not a Parent'),null)
		}
	});
}

module.exports.getActivityRecords = function(user, child_id, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			// query ChildActivityRecord by DATE and the associated ActivityRecord
		}
		else
		{
			callback(new Error('User is not a Parent'),null)
		}
	});
}

module.exports.getCurrentActivities = function(user, room_id, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			// Query Schedule for 'activities' which matches the room_id the Child/Children is in
			// Maybe we could query activities per day, for now, just retrieve all activities
			
			mysql_query('SELECT * FROM Schedule INNER JOIN Activity on Schedule.activity_id = Activity.id WHERE Schedule.room_id = ?', room_id, (err, schedule) => { 
				if(err) callback(err, null);
				callback(err, schedule);
			});
		}
		else
		{
			callback(new Error('User is not a Parent'),null)
		}
	});
}

module.exports.validateParent = function(role_type, callback) {
	if(role_type === PARENT)
	{
		callback(true);
	} 
	else
	{
		callback(false);
	}
}