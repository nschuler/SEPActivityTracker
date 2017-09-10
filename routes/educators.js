const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var Educator = require('../models/educator')

// Children
router.get('/children', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Educator.getChildren(req.user[0].id, (err, data) => {
		if(err){
			res.json({success: false, msg:'Request failed'});
		} else {
			res.json({success: true, msg:'Children data', children:data});
		}
	});
});

module.exports = router;