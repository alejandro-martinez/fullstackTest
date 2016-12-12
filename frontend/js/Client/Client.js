"use strict";

angular.module('FullstackApp.Client', ['ngRoute'])
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
.controller('ClientCtrl', [ '$scope', 'ClientSvc', 'ClientFct', function( $scope, ClientSvc, ClientFct ) {
	
	var vm = this;
	vm.clients = [];

	// Modal wiwndow config
	vm.modalShown = false;
	vm.modalContent = "js/Client/edit_form.html"
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
		ClientSvc.delete( vm.client ).then(function( response ) {
			console.log(response.data)
		});
	}

	vm.saveClient = function() {
		ClientSvc.save( vm.client ).then(function( response ) {
			if ( response.data.created ) vm.clients.push( response.data.model );

			vm.toggleModal();
		});
	}

	ClientSvc.getAll().then( function( clients ) {
		vm.clients = clients.data;
	});
}]);