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
	this.delete = function( provider ) { return $http.delete('/providers/:id', provider) }
	this.save = function( provider ) { return $http.post('/providers/:id', provider) }
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