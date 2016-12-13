"use strict";
angular.module('FullstackApp.Provider',[])
.factory('ProviderFct', [function() {

	var providerFct = {
		new: function() {

			var model = {
				id: null,
				name: ""
			};

			return model;	
		}
	}

	return providerFct;
}])
.service('ProviderSvc', ['$http', function( $http ) {

	this.getAll = function() { return $http.get('/providers')	}
	this.delete = function( client ) { return $http.delete('/providers/:id', client) }
	this.save = function( client ) { return $http.post('/providers/:id', client) }
}])
.controller('ProviderCtrl', [ '$scope', 'ProviderSvc', function( $scope, ProviderSvc ) {

	$scope.providers = [];
	$scope.check = { checked: true };

	ProviderSvc.getAll().then( function( providers ) {
		$scope.providers = providers.data;
	});

}]);