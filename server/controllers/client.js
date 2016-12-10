module.exports = function( app ) {
	
	app.get('/clients', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.get('/clients/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.post('/clients/delete/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.post('/clients/save/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});
}