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
	var newProviders = [];
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
			var i = vm.clients.map(function(_c) { return _c.id; }).indexOf( _client.id );
			var client = findClient( _client.id );
					
			// Reset not saved changes in client providers list
			if ( client ) {
				client.providers.map(function(p) { 
					delete p.deleted;
					return p;
				});
			}
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
	
	// Refresh client_providers list
	vm.refreshProvidersList = function() {
		vm.client.providers = vm.client.providers.filter(function( p ) {
			return !p.hasOwnProperty('deleted') && !p.deleted;
		});
		newProviders = [];
	}

	// Creates or update a client
	vm.saveClient = function() {
		
		vm.client.providers = vm.client.providers.concat( newProviders );

		ClientSvc.save( vm.client ).then(function( res ) {

			vm.refreshProvidersList();
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

	// Adds or Delete client providers
	vm.toggleProvider = function( provider ) {		
		var found = vm.findProvider( provider.id );
		( found ) ? found.deleted = !found.deleted : newProviders.push( provider );
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

	$scope.$on('providersChange', function (event, provider) {
		var i = newProviders.map(function(p) { return p.id; }).indexOf( provider.id );
		newProviders.splice(i,1);
		vm.toggleProvider( provider );
		vm.loadClientList();
	});

	vm.loadClientList();
})