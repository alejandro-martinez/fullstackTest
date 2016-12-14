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
	vm.modalContent = "js/Client/edit_form.html";

	vm.toggleModal = function() { vm.modalShown = !vm.modalShown }

	// Open a modal window to create / update a client
	vm.editClient = function( client ) {
		vm.toggleModal();
		vm.client = (client) ? client : ClientFct.new();
	}

	// Creates or update a client
	vm.saveClient = function() {
		ClientSvc.save( vm.client ).then(function( res ) {
			if ( res.data.created ) vm.clients.push( res.data.model );
			vm.toggleModal();
		});
	}

	vm.deleteClient = function() {
		ClientSvc.delete( vm.client ).then(function( res ) {
			console.log(res.data)
		});
	}

	// Adds or Delete client providers
	vm.toggleProvider = function( provider ) {		
		var found = vm.findProvider( provider.id );
		( found ) ? found.deleted = !found.deleted : vm.client.providers.push( provider );
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

	// Returns list of clients
	ClientSvc.getAll().then( function( res ) {
		vm.clients = res.data;
	});
}])