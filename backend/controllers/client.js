var models  = require('../models/index');

module.exports = function( app ) {
	
	app.get('/clients', function(req, res, next) {
		res.json([{id:1,name:"Test",phone:"303-202-1020",providers:[{id:1,name:"Provider1"}]}])
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

	app.delete('/clients/:id', function(req, res, next) {
		models.client.destroy({ where: { id: req.params.id }}).then(function ( err, a ) {
			res.json({ success: err > 0 });
		});
	});

	// Creates or update a client and it's providers
	app.post('/clients/:id', function(req, res, next) {

		var onClientUpdated = function( client, created ) {
			var response = { success: true, id: client.id, created: created, success: true };

			models.sequelize.transaction(function( t ) { 

				var onNext = function( p ) {
					var provider = { client_id: client.id, provider_id: p.id },
						params = { where: provider, defaults: provider, transaction: t };
						action = ( p.deleted ) ? 'destroy' : 'findOrCreate';

						return models.client_provider[action]( params ).catch(function(err) {
							response.success = false;
						});					
				}
				return models.sequelize.Promise.map( req.body.providers, onNext);

			}).then(function() {
				res.json( response );
			});
		}
		var params = { where: { id: req.body.id }, defaults: req.body };

		models.client.findOrCreate( params ).spread( onClientUpdated ).catch(function(err) {
			res.json( { success: false, err: err.errors[0].message });
		});					
	})
}