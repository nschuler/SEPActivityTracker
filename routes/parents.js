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
	Parent.getFamily(req.user[0].id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Family data', family:data});
		}
	});
});

// Child Activity Records
router.post('/activityrecords', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.getActivityRecords(req.user[0].id, req.body.child_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Activity Records', records:data});
		}
	});
});

// Child Current Activities
router.post('/currentactivities', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.getCurrentActivities(req.user[0].id, req.body.room_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Current Activities', activities:data});
		}
	});
});

module.exports = router;