"use strict";

angular.module('FullstackApp.Client', ['ngRoute', 'FullstackApp.Provider'])
.config(function( $routeProvider ) {
	
	$routeProvider.
		when("/", 	{ 
			templateUrl: "js/Client/index.html"
		}).
		when("/clients/:id",{ 
			templateUrl: "Client/edit.html"
		}).
		otherwise({ redirectTo: '/' });
})
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
.service('ClientSvc',function( $http ) {
	
	this.getAll = function() { return $http.get('/clients')	}
	this.delete = function( client ) { return $http.delete('/clients/' + client.id) }
	this.save = function( client ) { return $http.post('/clients/:id', client) }
})
.controller('ClientCtrl', function( $scope, ClientSvc, ClientFct) {
	
	var vm = this;
	vm.clients = [];	
	vm.modalContent = "js/Client/edit_form.html";
	
	var showError = function( err ) {
		alert("Sorry, an error ocurred: ".concat( err ));
	}

	vm.toggleModal = function() { 
		vm.modalShown = !vm.modalShown;
	}

	var findClient = function( id, onlyIndex ) {
		var i = vm.clients.map(function(_c) { return _c.id; }).indexOf( id );
		return (onlyIndex) ? i : vm.clients[i];	
	}

	// Open a modal window to create / update a client
	vm.editClient = function( _client ) {
		if ( _client ) {
			var client = findClient( _client.id );		
		}
		vm.client = (client) ? client : ClientFct.new();

		vm.toggleModal();
	}

	vm.deleteClient = function() {
		if (confirm("Are you sure you want to delete the client: ".concat(vm.client.name,"?"))) {
			ClientSvc.delete( vm.client ).then(function( res ) {
				if ( res.data.success ) {
					vm.clients.splice( findClient( vm.client.id, true ), 1);
					vm.toggleModal();
				}
				else {
					showError( res.data.err );
				}
			});
		}	
	}

	// Creates or update a client
	vm.saveClient = function() {

		ClientSvc.save( vm.client ).then(function( res ) {

			if ( res.data.success ) {
				if ( res.data.created ) {
					vm.client.id = res.data.id;
					vm.clients.push( vm.client);
				}	
				vm.toggleModal();
			}
			else {
				showError( res.data.err );
			}
		}).catch(function( res ) {
			showError( res.data.err );
		});
	}

	// Asociates a provider to a client
	vm.toggleProvider = function( provider ) {	
		if ( vm.isClientProvider( provider.id ))	{
			var index = vm.findProvider( provider.id, true );
			vm.client.client_providers.splice(index, 1 );
		}
		else {
			vm.client.client_providers.push({ id: provider.id })
		}
	}

	// Find a provider in client_providers list
	vm.findProvider = function( id ) {
		var found = vm.client.client_providers.filter(function(p, k, _this) { 
			return ( p.id === id ) && _this[k];
		});
		return found[0];
	}

	// Returns true if provider is as asociated with the client
	vm.isClientProvider = function(id) {
		return vm.client && vm.findProvider( id ); 
	}

	$scope.$on('providersChange', function (event, provider) {
		var i = newProviders.map(function(p) { return p.id; }).indexOf( provider.id );
		newProviders.splice(i,1);
		vm.toggleProvider( provider );
		vm.loadClientList();
	});

	// Returns list of clients
	ClientSvc.getAll().then( function( res ) {
		vm.clients = res.data;
	});
})