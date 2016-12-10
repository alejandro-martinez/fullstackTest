var models  = require('../models/index');

module.exports = function( app ) {
	
	app.get('/clients', function(req, res, next) {
		models.client.findAll().then(function( clients ) {
			res.json( clients );	
		});
	});

	app.get('/clients/:id', function(req, res, next) {
		models.client.findOne({ id: req.params.id }).then(function( client) {
			res.json( client );	
		});
	});

	app.delete('/clients/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.post('/clients/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.put('/clients/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});
}