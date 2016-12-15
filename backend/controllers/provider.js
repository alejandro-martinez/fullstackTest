var models  = require('../models/index');

module.exports = function( app ) {
	
	app.get('/providers', function(req, res, next) {
		res.json([{id:1, name:"prov 1"}])
		models.provider.findAll().then(function( providers) {
			res.json( providers );
		});	
	});

	app.delete('/providers/:id', function(req, res, next) {
		models.provider.destroy({where: { id: req.params.id }}).then(function () {
			res.json({ deleted: true });
		});
	});

	app.post('/providers/:id', function(req, res, next) {
		models.provider
			.findOrCreate({ where: { id: req.body.id }, defaults: req.body })
			.spread( function( provider, created ) {
				res.json({ created: created, model: provider.get({ plain: true }) })
		});
	});
}