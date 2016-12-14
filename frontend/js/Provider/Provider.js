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
.controller('ProviderCtrl', [ '$scope', 'ProviderSvc', 'ProviderFct',
	function( $scope, ProviderSvc, ProviderFct ) {

	angular.extend($scope, {
		providers: [],
		check: { checked: true },
		newProvider: ProviderFct.new()
	});
	
	$scope.addProvider = function() {
		ProviderSvc.save( $scope.newProvider ).then(function( res ){
			if ( res.data.created ) {
				$scope.providers.push( res.data.model );
			}
		});
	}

	ProviderSvc.getAll().then( function( res ) {
		$scope.providers = res.data;
	});

}]);