var models  = require('../models/index');

module.exports = function( app ) {
	
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

	app.delete('/clients/:id', function(req, res, next) {
		models.client.destroy({ where: { id: req.params.id }}).then(function ( deleted) {
			res.sendStatus(200);
		});
	});

	// Creates or update a client and their providers
	app.post('/clients/:id', function(req, res, next) {
		var response = { success: false },
			params = { 
					where: { id: req.body.id }, 
					defaults: req.body, 
					update: { phone: req.body.phone,  email: req.body.email }
			};

		// Reload the client model and send to the user
		var sendResponse = function() {
			var asociatedModel = {
				include: [{ model: models.client_provider, attributes: [['provider_id', 'id']]}]
			};
			
			models.client.findOne(asociatedModel).then(function( client ) {
				Object.assign(response, { client: client });							
				res.status(200).json(response);
			});
		}

		// Deletes or creates client_providers
		var updateClientProviders = function( t, client, prov) {
				var provider = { client_id: client.id, provider_id: prov.id },
				params = { where: provider, defaults: provider, transaction: t };
				action = ( prov.delete ) ? 'destroy' : 'findOrCreate';

				return models.client_provider[action]( params ).catch(function(err) {
					res.sendStatus(500).json({ err: err.errors[0].message });
				});
		}


		var onClient = function( client, created ) {
			response.created = created;
			if (!created) {
				client.updateAttributes( params.update ).then(function() {
					// Deletes or creates client_providers	
					models.sequelize.transaction(function( t ) { 
						return models.sequelize.Promise.map( req.body.client_providers, updateClientProviders.bind(this,t,client));
					}).then( sendResponse );
				}).catch(function(err) {
					response.err = ;
					res.status(500).json({err: models.client.getMsgError(err.name)});
				});
			}
			else {
				sendResponse();
			}
		}
		
		// Updates o create a client
		models.client.findOrCreate( params ).spread( onClient ).catch(function(err) {
			res.status(500).json( { err: models.client.getMsgError(err.name) });
		});
	})
}