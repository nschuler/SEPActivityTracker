const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var Educator = require('../models/educator')

// All Children
router.get('/allchildren', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.getChildren(req.user[0].id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'All Children data', children:data});
		}
	});
});

// Children Associated with a Room
router.post('/childrenroom', passport.authenticate('jwt', {session:false}), (req, res, next) => {

	Educator.getChildrenInRoom(req.user[0].id, req.body.room_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Children data', children:data});
		}
	});
});

// Rooms
router.get('/rooms', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.getRooms(req.user[0].id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Data', data});
		}
	});
});

router.post('/updateroom', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.updateRoom(req.user[0].id, req.body.room, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Updated'});
		}
	});
});

// Activities
router.get('/allactivities', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.getAllActivities(req.user[0].id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Data', data});
		}
	});
});

router.post('/activitiesbyroomid', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.getActivitiesByRoomId(req.user[0].id, req.body.room_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Data', data});
		}
	});
});

router.post('/roombyid', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.getRoomById(req.user[0].id, req.body.room_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Data', data});
		}
	});
});

router.post('/deleteroom', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.deleteRoomByID(req.user[0].id, req.body.room_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Deleted' + data});
		}
	});
});

router.post('/createactivity', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.createActivity(req.user[0].id, req.body.activity, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Created'});
		}
	});
});

router.post('/deleteactivity', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	console.log('delete activity');
	res.json({success: true, msg:'delete activity', data});
});

router.post('/updateactivity', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.updateActivity(req.user[0].id, req.body.activity, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Updated'});
		}
	});
});

module.exports = router;