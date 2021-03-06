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

				mysql_query('SELECT * FROM Family INNER JOIN Child ON Family.id = Child.family_id WHERE Family.id = ?', familyMember[0].family_id, (err, children) => { 
					if(err) callback(err, null);

					let familyData = {
						familyName: children[0].family_name,
						address: children[0].address,
						children: children
					};

					callback(err, familyData);
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
			// Maybe we could query activityrecords by DATE, for now just retrieve all.

			mysql_query('SELECT ChildActivityRecord.id, ChildActivityRecord.comments, ChildActivityRecord.child_id, ChildActivityRecord.date, ChildActivityRecord.activity_record_id, ActivityRecord.type, ActivityRecord.name, ActivityRecord.description, ActivityRecord.room_name, ActivityRecord.start_time, ActivityRecord.end_time FROM ChildActivityRecord INNER JOIN ActivityRecord ON ChildActivityRecord.activity_record_id = ActivityRecord.id WHERE ChildActivityRecord.child_id = ?', child_id, (err, record) => { 
				if(err) callback(err, null);
				callback(err, record);
			});
		}
		else
		{
			callback(new Error('User is not a Parent'),null)
		}
	});
}

module.exports.commentOnChildActivityRecord = function(user, commentData, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			//TODO: validate whether parent is in same family as child
			let newComment = {
				comment: commentData.comment,
				date: Date.now(),
				author: user.first_name + " " + user.last_name
			}

			mysql_query('SELECT comments FROM ChildActivityRecord WHERE id = ?', commentData.activityrecord_id, (err,data) => { 
				if(err) callback(err,null);
				let commentObject = JSON.parse(data[0].comments);
				commentObject.comments.push(newComment); // Add new comment
				
				mysql_query('UPDATE ChildActivityRecord SET comments = ? WHERE id = ?',[JSON.stringify(commentObject),commentData.activityrecord_id],(err,data)=>{
					callback(err,data);
				});
			});
		}
		else
		{
			callback(new Error('User is not a Parent'),null)
		}
	});
}

module.exports.deleteCommentOnChildActivityRecord = function(user, commentData, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			//TODO: validate whether parent is in same family as child

			let index = undefined;

			mysql_query('SELECT comments FROM ChildActivityRecord WHERE id = ?', commentData.activityrecord_id, (err,data) => { 
				if(err) callback(err,null);
				let commentObject = JSON.parse(data[0].comments);

				for(i in commentObject.comments)
				{
					if(commentObject.comments[i].comment == commentData.comment)
					{
						if(commentObject.comments[i].author)
						{
							index = i;
						}
					}
				}

				if(index)
				{
					commentObject.comments.splice(index,1); // first element removed
					
					mysql_query('UPDATE ChildActivityRecord SET comments = ? WHERE id = ?',[JSON.stringify(commentObject),commentData.activityrecord_id],(err,data)=>{
						callback(err,data);
					});
				}
				else
				{
					callback(new Error('No comment was deleted'), null);
				}
			});
		}
		else
		{
			callback(new Error('User is not a Parent'),null);
		}
	});
}

module.exports.addNote = function(user, noteData, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			//TODO: validate whether parent is in the same faily as child

			let newNote = {
				note: noteData.note,
				date: Date.now(),
				author: user.first_name + " " + user.last_name
			}

			mysql_query('SELECT notes FROM Child WHERE id = ?', noteData.child_id, (err,data) => { 
				if(err) callback(err,null);
				let notesObject = JSON.parse(data[0].notes);
				notesObject.notes.push(newNote); // Add new comment
				
				mysql_query('UPDATE Child SET notes = ? WHERE id = ?',[JSON.stringify(notesObject),noteData.child_id],(err,data)=>{
					callback(err,data);
				});
			});
		}
		else
		{
			callback(new Error('User is not a Parent'),null)
		}
	});
}

module.exports.deleteNote = function(user, noteData, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			//TODO: validate whether parent is in same family as child

			let index = undefined;

			mysql_query('SELECT notes FROM Child WHERE id = ?', noteData.child_id, (err,data) => { 
				if(err) callback(err,null);
				let notesObject = JSON.parse(data[0].notes);

				for(i in notesObject.notes)
				{
					if(notesObject.notes[i].note == noteData.note)
					{
						if(notesObject.notes[i].author)
						{
							index = i;
						}
					}
				}

				if(index)
				{
					notesObject.notes.splice(index,1); // first element removed
					
					mysql_query('UPDATE Child SET notes = ? WHERE id = ?',[JSON.stringify(notesObject),noteData.child_id],(err,data)=>{
						callback(err,data);
					});
				}
				else
				{
					callback(new Error('No comment was deleted'), null);
				}
			});
		}
		else
		{
			callback(new Error('User is not a Parent'),null);
		}
	});
}

module.exports.getCurrentActivities = function(user, room_id, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
			mysql_query('SELECT * FROM Schedule INNER JOIN Activity ON Schedule.activity_id = Activity.id WHERE Schedule.room_id = ?', room_id, (err, schedule) => { 
				if(err) callback(err, null);
				let dateNow = new Date();
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


					if(startDate.getDate() == dateNow.getDate() && startDate.getMonth() == dateNow.getMonth() && startDate.getYear() == dateNow.getYear())
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
			callback(new Error('User is not a Parent'),null)
		}
	});
}

module.exports.getActivities = function(user, room_id, date_data, callback) {
	this.validateParent(user.role_type, (valid) => { 
		if(valid)
		{
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