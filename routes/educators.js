const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var Educator = require('../models/educator')


// All Educators
router.get('/all', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.getEducators(req.user[0], (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'All Educators', educators:data});
		}
	});
});

// All Children
router.get('/allchildren', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.getChildren(req.user[0], (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'All Children data', children:data});
		}
	});
});

// Children Associated with a Room
router.post('/childrenroom', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.getChildrenInRoom(req.user[0], req.body.room_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Children data', children:data});
		}
	});
});

// Add Child to Room
router.post('/addchild', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.addChildToRoom(req.user[0], req.body.room_id, req.body.child_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Child Added to Room'});
		}
	});
});

// Remove Child from Room
router.post('/removechild', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.removeChildFromRoom(req.user[0], req.body.child_id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Child Removed from Room'});
		}
	});
});

// Rooms
router.get('/rooms', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.getRooms(req.user[0], (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Data', data});
		}
	});
});

router.post('/updateroom', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.updateRoom(req.user[0], req.body.room, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Updated'});
		}
	});
});

// Activities
router.get('/allactivities', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.getAllActivities(req.user[0], (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Data', data});
		}
	});
});

router.post('/activitiesbyroomid', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.getActivitiesByRoomId(req.user[0], req.body.room_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Data', data});
		}
	});
});

router.post('/roombyid', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.getRoomById(req.user[0], req.body.room_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Data', data});
		}
	});
});

router.post('/logintoroom', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.loginToRoom(req.user[0], req.body.room_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Logged in to room'});
		}
	});
});

router.get('/logoutofroom', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.logoutOfRoom(req.user[0], (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Logged out of room'});
		}
	});
});

router.post('/createroom', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.createRoom(req.user[0], req.body.room, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Created' + data});
		}
	});
});

router.post('/deleteroom', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.deleteRoomByID(req.user[0], req.body.room_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Room Deleted'});
		}
	});
});

router.post('/createactivity', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.createActivity(req.user[0], req.body.activity, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Created'});
		}
	});
});

router.post('/deleteactivity', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.deleteActivity(req.user[0], req.body.activity_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Deleted'});
		}
	});
});

router.post('/updateactivity', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.updateActivity(req.user[0], req.body.activity, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Updated'});
		}
	});
});

router.get('/getactivitytypes', passport.authenticate('jwt', {session:false}), (req, res, next) => { 
	Educator.getActivityTypes(req.user[0], (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Types', data:data});
		}
	});
});

router.post('/createactivityinstance', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.createActivityInstance(req.user[0], req.body.activity, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Created'});
		}
	});
});

router.post('/deleteactivityinstance', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.deleteActivityInstance(req.user[0], req.body.activity_instance_id, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Deleted'});
		}
	});
});

router.post('/updateactivityinstance', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.updateActivityInstance(req.user[0], req.body.activity, (err, data) => { 
		if(err){ 
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Activity Updated'});
		}
	});
});

module.exports = router;