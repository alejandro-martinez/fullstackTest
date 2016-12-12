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
		models.client.destroy({where: {}}).then(function () {
			res.json(true)
		});
	});

	// current
	app.post('/clients/:id', function(req, res, next) {
		models.client
			.findOrCreate({ where: { id: req.body.id }, defaults: req.body })
			.spread( function( client, created ) {
				res.json({ created: created, model: client.get({ plain: true }) })
		});
	});
}