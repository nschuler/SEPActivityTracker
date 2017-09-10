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