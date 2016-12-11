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
	this.getById = function() { return $http.get('/clients')	}
}])
.controller('ClientCtrl', [ '$scope', 'ClientSvc', function( $scope, ClientSvc ) {
	
	var vm = this;
	vm.clients = [];

	vm.addClient = function() {

	}

	ClientSvc.getAll().then( function( clients ) {
		console.log(clients.data)
		vm.clients = clients.data;
	});
	
}]);