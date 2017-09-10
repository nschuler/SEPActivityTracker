const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const passport = require('passport');
const mongoose = require('mongoose');
// const mysql = require('mysql');
const config = require('./config/database');


const app = express();

const users = require('./routes/users'); // Contains our User Routes
const parents = require('./routes/parents'); // Contains our Parent Routes
const educators = require('./routes/educators'); // Contains our Parent Routes

// PORT Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors()); // Alows us to make a request to our API with a different domain name

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users); // Use /users for all our user routes
app.use('/parents', parents); // Use /parents for all our user routes
app.use('/educators', educators); // Use /parents for all our user routes

// Index Route
app.get('/', (req, res) => {
  res.send('GET request to the homepage');
});

app.get('*', () => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
	console.log('Server started on port '+port);
});