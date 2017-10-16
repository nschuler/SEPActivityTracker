const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var Parent = require('../models/parent')

// Family
router.get('/family', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.getFamily(req.user[0], (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Family data', family:data});
		}
	});
});

// Child Activity Records
router.post('/activityrecords', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.getActivityRecords(req.user[0], req.body.child_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Activity Records', records:data});
		}
	});
});

// Comment on Activity Record
router.post('/commentonchildactivityrecord', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.commentOnChildActivityRecord(req.user[0], req.body.data, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Comment Made'});
		}
	});
});

// Delete Comment on Activity Record
router.post('/deletecommentonchildactivityrecord', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.deleteCommentOnChildActivityRecord(req.user[0], req.body.data, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Comment Deleted'});
		}
	});
});

// Add Note on Child
router.post('/addnote', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.addNote(req.user[0], req.body.data, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Note Made'});
		}
	});
});

// Delete Note on Child
router.post('/deletenote', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.deleteNote(req.user[0], req.body.data, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Note Deleted'});
		}
	});
});

// Child Current Activities
router.post('/currentactivities', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.getCurrentActivities(req.user[0], req.body.room_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Current Activities', activities:data});
		}
	});
});

// Child Future Activities
router.post('/getactivities', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Parent.getActivities(req.user[0], req.body.room_id, req.body.date, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request Failed'});
		} else {
			res.json({success: true, msg:'Future Activities', activities:data});
		}
	});
});

module.exports = router;