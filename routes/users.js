const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var User = require('../models/user')

// Register 
router.post('/register', (req, res, next) => {
	let newUser = new User(req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.email, req.body.mobile, req.body.dob);

	// Check that there isnt an existing user with the same username
	User.getUserByUsername(req.body.username, (err,user) => {
		if(err) throw err;
		if(user.length == 0){
			// Add User
			User.addUser(newUser, (err, user) => {
				if(err){
					console.log(err);
					res.json({success: false, msg:'Failed to register user'});
				} else {
					res.json({success: true, msg:'User Registered'});
				}
			});
		} else {
			res.json({success: false, msg:'Username Taken'});
		}
	});
});

// Authenticate 
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if (user.length == 0){
			return res.json({success:false, msg: "User not found"});
		}

		User.comparePassword(password, user[0].password, (err, isMatch) => {
			if(err) throw err;
			if (isMatch){
				const token = jwt.sign(user[0], config.secret, {
					expiresIn: 1800 // 30 mins
				});

				res.json({
					success: true,
					token: 'Bearer '+token,
					user: {
						id: user[0].id,
						first_name: user[0].first_name,
						last_name: user[0].last_name,
						username: user[0].username,
						email: user[0].email,
						mobile: user[0].mobile
					}
				});
			} else {
				return res.json({success:false, msg: "Wrong Password"});
			}
		});
	});
});

// Profile 
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	res.json({user: req.user[0]})
});

module.exports = router;