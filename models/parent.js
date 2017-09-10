const bcrypt = require('bcryptjs');
const config = require('../config/database');
const dateformat = require('dateformat');
var mysql_query = require('../connection');

var PARENT = 1;

// Not sure if we will need a parent object..
function Parent(family_id) {
	this.family_id = family_id;
}
	

module.exports = Parent;

module.exports.getFamily = function(id, callback) {

	this.validateParent(id, (err, valid) => { 
		if(err) throw err;
		if(valid)
		{
			mysql_query('SELECT family_id FROM FamilyMember WHERE id = ?', id, (err, familyMember) => { 
				if(err) throw err;

				mysql_query('SELECT * FROM Family WHERE id = ?', familyMember[0].family_id, (err, family) => {
					if(err) throw err;

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
			console.log('Not a parent');
		}
	});
}


module.exports.validateParent = function(id, callback) {
	mysql_query('SELECT role_type FROM Role WHERE id = ?', id, (err, data) => {
		if(data[0].role_type == PARENT)
		{
			callback(err, true);
		}
		else
		{
			callback(err, false);
		}
	});
}

