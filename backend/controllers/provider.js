module.exports = function( app ) {
	
	app.get('/providers', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.get('/providers/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.delete('/providers/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.post('/providers/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});

	app.put('/providers/:id', function(req, res, next) {
	  res.json( [ {id:1,name:"Ale",phone:"123123"} ] );
	});
}