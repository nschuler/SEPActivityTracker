const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var Parent = require('../models/parent')

// Timetable
router.get('/timetable', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	res.json({msg: "Load timetable for user: " + req.user[0].id + "s Children..."});
});

// Family
router.get('/family', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	// Using req.user[0].id check get children
	Parent.getFamily(req.user[0].id, (err, data) => {
		if(err){
			console.log(err);
			res.json({success: false, msg:'Failed to get children'});
		} else {
			res.json({success: true, msg:'Children data', family:data});
		}
	});
});

module.exports = router;