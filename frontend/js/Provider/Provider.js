"use strict";

angular.module('FullstackApp.Provider', ['ngRoute'])
.config([ '$routeProvider', function( $routeProvider ) {
	
	$routeProvider.
		when("/Providers", 	{ 
			templateUrl: "js/Provider/index.html", 
			controller: "ProviderCtrl" 
		}).
		when("/Providers/:id",{ 
			templateUrl: "Provider/edit.html", 	
			controller: "ProviderCtrl" 
		}).
		otherwise({ redirectTo: '/Providers' });
}])
.service('ProviderSvc', [ '$http', function( $http ) {

}])
.controller('ProviderCtrl', [ '$scope', 'ProviderSvc', function( $scope, ProviderSvc ) {
	
	var vm = this;
	vm.Providers = [];

	ProviderSvc.getAll().then( function( Providers ) {
		vm.Providers = Providers;
	});

}]);