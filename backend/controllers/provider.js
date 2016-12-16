var models  = require('../models/index');

module.exports = function( app ) {
	
	app.get('/providers', function(req, res, next) {
		models.provider.findAll().then(function( providers) {
			res.json( providers );
		});	
	});

	app.delete('/providers/:id', function(req, res, next) {
		models.provider.destroy({ where: { id: req.params.id } }).then(function () {
			res.json({ deleted: true });
		});
	});

	app.post('/providers/:id', function( req, res, next ) {

		var updateCreate = function( callback ) {
			models.provider
				.findOrCreate({ where: { id: req.body.id }, defaults: req.body })
				.spread( function( provider, created ) {
					var response = { created: created, model: provider.get({ plain: true }) };

					if ( !created ) {
						provider.name = req.body.name;
						provider.save().then(function() {
							callback( response );
						});
					}
					else {
						callback( response );
					}
			});
		}

		updateCreate(function( response ) {
			res.json( response );
		});
	});
}