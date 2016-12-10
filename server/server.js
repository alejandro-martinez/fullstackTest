"use strict";

const http = require("http");

const server = http.createServer(function(request, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World\n');
}).listen(8000, function() {
	console.log("Running server on localhost:8000")	
});