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
.service('ClientSvc', [ '$http', function( $http ) {
	
	this.getAll = function() { return $http.get('/clients')	}
	this.delete = function() { return $http.delete('/clients/:id') }
	this.update = function() { return $http.put('/client/:id') }
	this.create = function() { return $http.post('/clients') }
}])
.controller('ClientCtrl', [ '$scope', 'ClientSvc', function( $scope, ClientSvc ) {
	
	var vm = this;
	vm.clients = [];

	// Modal wiwndow config
	vm.modalShown = false;
	vm.modalContent = "js/Client/edit_form.html"
	vm.toggleModal = function() { vm.modalShown = !vm.modalShown }

	vm.addClient = function() {
		vm.toggleModal();
		vm.modalShown = !vm.modalShown;
		vm.formTitle = "New Client";
	}

	vm.editClient = function( client ) {
		vm.toggleModal();
		vm.formTitle = "Edit Client";

		vm.client = client;
	}

	vm.deleteClient = function() {
		ClientSvc.delete( vm.client ).then(function( response ) {
			console.log(response.data)
		});
	}

	vm.updateClient = function() {
		ClientSvc.update( vm.client ).then(function( response ) {
			console.log(response.data)
		});
	}

	ClientSvc.getAll().then( function( clients ) {
		vm.clients = clients.data;
	});
}]);