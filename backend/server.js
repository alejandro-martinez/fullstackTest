"use strict";

var express = require('express');
var app = express();
var routes = require('./controllers/index');
var bodyParser = require('body-parser');

// Express config
app.use( express.static( __dirname + '/../frontend'));
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

// Server 
app.listen( 8000, function() {
	console.log("Running server on localhost:8000")	
});

// REST ROUTES
require('./controllers/index')( app );
require('./controllers/client')( app );
require('./controllers/provider')( app );