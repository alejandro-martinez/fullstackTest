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
				client_providers:[]
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
.controller('ClientCtrl', function( $scope, ClientSvc, ClientFct, ProviderSvc) {
	
	var vm = this;
	vm.clients = [];	
	vm.modalContent = "js/Client/edit_form.html";

	$scope.showError = function( err ) {
		alert("Sorry, an error ocurred: ".concat( err ));
	}

	vm.toggleModal = function() { 
		vm.modalShown = !vm.modalShown;
	}

	var findIndex = function( array, id ) {
		return array.map(function(elem) { return elem.id; }).indexOf( id );
	}

	vm.formatClientProviders = function( providers ) {
		if ( $scope.providers.length && providers.length) {
			var list = [];
			providers.forEach(function( p ) {
				var index = findIndex( $scope.providers, p.id );
				if ($scope.providers[ index ]) {
					list.push( $scope.providers[ index ].name );
				}
			});
		
			return list.join(",");
		}
		return "";
	}
	
	// Refresh client_providers list on the index page
	vm.refreshClientProvidersList = function( providers ) {
		vm.clients.map(function( c) {
			if ( c.id === vm.client.id ) {
				c.client_providers = providers;
			}
			return c;
		});
	}

	var findClient = function( id, onlyIndex ) {
		var i = findIndex( vm.clients, id );
		return (onlyIndex) ? i : vm.clients[i];	
	}

	// Open a modal window to create / update a client
	vm.editClient = function( id ) {
		var client = findClient( id );
		vm.client = (client) ? client : ClientFct.new();

		vm.toggleModal();
	}

	vm.deleteClient = function() {
		if (confirm("Are you sure you want to delete the client: ".concat(vm.client.name,"?"))) {
			ClientSvc.delete( vm.client ).then(function( res ) {
				vm.clients.splice( findClient( vm.client.id, true ), 1);
				vm.toggleModal();
			}).catch(function(err) {
				$scope.showError( res.statusText );
			});
		}	
	}

	// Creates or update a client
	vm.saveClient = function( form ) {
		if ( form.$valid ) {
			ClientSvc.save( vm.client ).then(function( res ) {
				if ( res.status === 200 ) {
					vm.refreshClientProvidersList( res.data.client.client_providers );
					if ( res.data.created ) vm.clients.push( vm.client );
					vm.toggleModal();
				}
				else {
					$scope.showError( res.data.err );
				}
			}).catch(function(err) {
				$scope.showError( res.statusText );
			});
		}
	}

	// Asociates a provider to a client
	vm.toggleProvider = function( provider ) {	
		if ( vm.isClientProvider( provider.id )) {
			var index = findIndex( vm.client.client_providers, provider.id );
			vm.client.client_providers[index].delete = true;
		}
		else {
			vm.client.client_providers.push({ id: provider.id })
		}
	}

	// Find a provider in client_providers list
	vm.findProvider = function( id ) {
		if ( vm.client.client_providers ) {
			var found = vm.client.client_providers.filter(function(p, k, _this) { 
				return ( p.id === id ) && _this[k];
			});
			return found[0];
		}
	}

	// Returns true if provider is as asociated with the client
	vm.isClientProvider = function(id) {
		return vm.client && vm.findProvider( id ); 
	}

	$scope.$on('providersChange', function( event, providers ) {
		$scope.providers = providers;		

		// Returns list of clients, and adds providers info to each one
		ClientSvc.getAll().then( function( res ) {
			vm.clients = res.data;
		});
	});
})