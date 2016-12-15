"use strict";

angular.module('FullstackApp.Client', ['ngRoute', 'FullstackApp.Provider'])
.config([ '$routeProvider', function( $routeProvider ) {
	
	$routeProvider.
		when("/", 	{ 
			templateUrl: "js/Client/index.html"
		}).
		when("/clients/:id",{ 
			templateUrl: "Client/edit.html"
		}).
		otherwise({ redirectTo: '/' });
}])
.factory('ClientFct', function() {
	
	var clientFct = {
		new: function() {

			var model = {
				id: null,
				name: "",
				phone:"",
				providers:[]
			}

			return model;	
		}
	}

	return clientFct;
})
.service('ClientSvc', [ '$http', function( $http ) {
	
	this.getAll = function() { return $http.get('/clients')	}
	this.delete = function( client ) { return $http.delete('/clients/:id', client) }
	this.save = function( client ) { return $http.post('/clients/:id', client) }
}])
.controller('ClientCtrl', [ '$scope', 'ClientSvc', 'ClientFct', 
	function( $scope, ClientSvc, ClientFct) {
	
	var vm = this;
	vm.clients = [];
	var providersAdded = [];
	vm.modalContent = "js/Client/edit_form.html";
	
	vm.toggleModal = function() { 
		vm.modalShown = !vm.modalShown;
	}

	// Open a modal window to create / update a client
	vm.editClient = function( clientIndex ) {
		var client = vm.clients[ clientIndex ];
		vm.toggleModal();
		
		// Reset not saved changes in client providers list
		if ( client ) {
			client.providers.map(function(p) { 
				delete p.deleted;
				return p;
			});
		}
		vm.client = (client) ? client : ClientFct.new();
	}

	vm.deleteClient = function() {
		if (confirm("Are you sure you want to delete the client: ".concat(vm.client.name,"?"))) {
			ClientSvc.delete( vm.client ).then(function( res ) {
				console.log(res.data)
			});
		}	
	}

	// Creates or update a client
	vm.saveClient = function() {
		
		vm.client.providers = vm.client.providers.concat( providersAdded );

		ClientSvc.save( vm.client ).then(function( res ) {
			
			// Refresh client_providers list
			vm.client.providers = vm.client.providers.filter(function( p ) {
				return !p.hasOwnProperty('deleted') && !p.deleted;
			});

			if ( res.data.created ) {
				vm.client.id = res.data.id;
				vm.clients.push( vm.client);
			}
			providersAdded = [];
			vm.toggleModal();

		}).catch(function( err ) {
			alert("Sorry, an error ocurred,",err)
		});
	}

	// Adds or Delete client providers
	vm.toggleProvider = function( provider ) {		
		var found = vm.findProvider( provider.id );
		console.log("Provider",provider);
		( found ) ? found.deleted = !found.deleted : providersAdded.push( provider );
	}

	// Find a provider in client_providers list
	vm.findProvider = function( id ) {
		var found = vm.client.providers.filter(function(p, k, _this) { 
			return ( p.id === id ) && _this[k];
		});
		return found[0];
	}

	// Returns true if provider is as asociated with the client
	vm.isClientProvider = function(id) {
		if ( vm.client ) {
			var found = vm.findProvider( id ); 
			return ( found && !found.deleted);
		}
	}

	vm.loadClientList = function() {
		// Returns list of clients
		ClientSvc.getAll().then( function( res ) {
			vm.clients = res.data;
		});
	}

	$scope.$on('providerDeleted', function (event, provider) {
		var i = providersAdded.map(function(p) { return p.id; }).indexOf( provider.id );
		providersAdded.splice(i,1);
		vm.toggleProvider( provider );
		vm.loadClientList();
	});

	vm.loadClientList();
}])