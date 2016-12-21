"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

process.on('uncaughtException', (err) => {
  console.log("There was an error: " + err);
});

// Express config
app.use( express.static( __dirname + '/../frontend'));
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

// Server 
app.listen( 8000, function() {
	console.log("Server running on localhost:8000")	
});

// REST ROUTES
require('./controllers/client')( app );
require('./controllers/provider')( app );