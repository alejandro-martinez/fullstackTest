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
		otherwise({ redirectTo: '/clients' });
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
	vm.modalShown = false;
	vm.modalContent = "js/Client/edit_form.html";

	vm.toggleModal = function() { vm.modalShown = !vm.modalShown }

	vm.addClient = function() {
		vm.toggleModal();
		vm.client = ClientFct.new();
	}

	vm.editClient = function( client ) {
		vm.toggleModal();
		vm.client = client;
	}

	vm.deleteClient = function() {
		ClientSvc.delete( vm.client ).then(function( res ) {
			console.log(res.data)
		});
	}

	vm.saveClient = function() {
		ClientSvc.save( vm.client ).then(function( res ) {
			if ( res.data.created ) {
				vm.clients.push( res.data.model );
			}
			vm.toggleModal();
		});
	}
	vm.toggleProvider = function( provider ) {
		
		var found = vm.getClientProvider( provider.id );
		if ( found.length ) {
			var i = vm.client.providers.indexOf( found);
			if ( i > 0 ) vm.client.providers[i].deleted = true;
		}
		else {
			vm.client.providers.push( provider );
		}
	}

	vm.getClientProvider = function( id ) {
		return vm.client.providers.filter(function(p) { 
			return ( p.id === id && !p.deleted );
		}); 
	}

	vm.isClientProvider = function(id) {
		if ( vm.client ) return vm.getClientProvider(id).length;
	}

	ClientSvc.getAll().then( function( res ) {
		vm.clients = res.data;
	});
}])