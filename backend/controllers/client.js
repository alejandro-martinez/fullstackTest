var models  = require('../models/index');

module.exports = function( app ) {
	
	app.get('/clients', function(req, res, next) {
		
		var onFind = function( clients ) {
			res.json( clients );	
		};

		var params = {
			include: [{ 
				model: models.provider,
				attributes: ['id', 'name']
			}]
		}
		models.client.findAll( params ).then( onFind );		
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
	// Creates or update a client
	app.post('/clients/:id', function(req, res, next) {

		var onClientUpdated = function( client, created ) {
			models.sequelize.transaction(function(t) { 

				var onNext = function( p ) {
					var params = { client_id: req.body.id, provider_id: p.id };
					var action = ( p.deleted ) ? 'destroy' : 'create'; 
					return models.client_provider[ action ]( params, { transaction: t });
				}

				return models.sequelize.Promise.map( req.body.providers, onNext);
			});
		}
		
		var params = { where: { id: req.body.id }, defaults: req.body };

		models.client.findOrCreate( params ).spread( onClientUpdated );
	})
}