var models  = require('../models/index');

module.exports = function( app ) {
	
	app.get('/providers', function(req, res, next) {
		models.provider.findAll().then(function( providers) {
			res.json( providers );
		});	
	});

	app.get('/providers/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.delete('/providers/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.post('/providers/:id', function(req, res, next) {
		models.provider
			.findOrCreate({ where: { id: req.body.id }, defaults: req.body })
			.spread( function( provider, created ) {
				res.json({ created: created, model: provider.get({ plain: true }) })
		});
	});
}