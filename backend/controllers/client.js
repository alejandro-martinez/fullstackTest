var models  = require('../models/index');

module.exports = function( app ) {
	
	// Return the clients list and their providers associated
	app.get('/clients', function(req, res, next) {
		var onFind = function( clients ) {
			res.json( clients );
		};

		var params = {
			include: [{ 
				model: models.client_provider,
				attributes: [['provider_id', 'id']]
			}]
		}
		models.client.findAll( params ).then( onFind );		
	});

	// Deletes a client from the database
	app.delete('/clients/:id', function(req, res, next) {
		models.client.destroy({ where: { id: req.params.id }}).then(function ( deleted) {
			res.sendStatus( 200 );
		});
	});

	// Creates or update a client and their associated providers
	app.post('/clients/:id', function(req, res, next) {
		var response = {},
			params = { 
					where: { id: req.body.id }, 
					defaults: req.body, 
					update: { phone: req.body.phone,  email: req.body.email }
			};

		var sendResponse = function( client ) {
			var findParams = {
				where: { id: client.id },
				include: [{ model: models.client_provider, attributes: [['provider_id', 'id']]}]
			};
			
			// Reloads the client instance and send to the user
			models.client.findOne( findParams ).then(function( client ) {
				Object.assign(response, { client: client });			
				res.status( 200 ).json(response);
			});
		}

		// Deletes or creates client_providers
		var updateClientProviders = function( t, client, prov) {
			var provider = { client_id: client.id, provider_id: prov.id },
			params = { where: provider, defaults: provider, transaction: t };
			action = ( prov.delete ) ? 'destroy' : 'findOrCreate';

			return models.client_provider[ action ]( params ).catch(function( err ) {
				console.log(err)
				res.status( 500 ).json({ err: err.errors[0].message });
			});
		}

		var onClient = function( client, created ) {
			response.created = created;
			
			client.updateAttributes( params.update ).then(function() {
				
				// Iterates the client_providers list to update them
				models.sequelize.transaction(function( t ) { 
					return models.sequelize.Promise.map( req.body.client_providers, updateClientProviders.bind(this,t,client));
				}).then(function() {
					sendResponse( client.get({ plain: true }) ) 
				});

			}).catch(function(err) {
				res.status( 500 ).json({ err: models.client.getMsgError(err.name) });
			});
		}
		
		// Updates o create a client
		models.client.findOrCreate( params ).spread( onClient ).catch(function(err) {
			res.status( 500 ).json( { err: models.client.getMsgError(err.name) });
		});
	})
}