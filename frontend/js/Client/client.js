"use strict";

angular.module('FullstackApp.Client', [])
config([ '$routeProvider', function( $routeProvider ) {
	
	$routeProvider.
		when("/", 	{ 
			templateUrl: "Client/index.html", 
			controller: "ClientCtrl" 
		}).
		when("/clients/:id",{ 
			templateUrl: "Client/edit.html", 	
			controller: "ClientCtrl" 
		}).
		otherwise({ redirectTo: '/clients' });
}])
.service('ClientSvc', [ $http, function( $http ) {

}])
.controller('ClientCtrl', [ $scope, ClientSvc, function( $scope, ClientSvc ) {
	
	var vm = this;
	vm.clients = [];

	ClientSvc.getAll().then(function( clients ) => {
		vm.clients = clients;
	});

	
}]);