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
			res.json({success: true, msg:'Children data', children:data});
		}
	});
});

// Children Associated with a Room
router.post('/childrenroom', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const room_name = req.body.room_name;

	Educator.getChildrenInRoom(req.user[0].id, room_name, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Children data', children:data});
		}
	});
});

module.exports = router;