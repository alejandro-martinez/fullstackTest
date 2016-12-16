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
	this.delete = function( provider ) { return $http.delete('/providers/' + provider.id) }
	this.save = function( provider ) { return $http.post('/providers/:id', provider) }
}])
.controller('ProviderCtrl', [ '$scope', 'ProviderSvc', 'ProviderFct',
	function( $scope, ProviderSvc, ProviderFct ) {

	angular.extend($scope, {
		providers: [],
		newProvider: ProviderFct.new()
	});
	
	$scope.addProvider = function() {
		ProviderSvc.save( $scope.newProvider ).then(function( res ){
			if ( res.data.created ) {
				$scope.providers.push( res.data.model );
			}
		});
	}

	$scope.editProvider = function( provider ) {
		var name = prompt("Enter the provider's name", provider.name);
		if ( angular.isString( name ) && name.length ) {
			provider.name = name;
			ProviderSvc.save( provider ).then(function( res ) {
				$scope.$emit('providersChange', provider);
			});
		}	
	}

	$scope.deleteProvider = function( provider ) {
		if (confirm("Are you sure you want to delete the provider: ".concat(provider.name,"?"))) {
			ProviderSvc.delete( provider ).then(function( res ) {
				if ( res.data.deleted ) {
					var i = $scope.providers.indexOf( provider );
					$scope.providers.splice(i, 1);
					$scope.$emit('providersChange', provider);
				}
			});
		}
	}

	ProviderSvc.getAll().then( function( res ) {
		$scope.providers = res.data;
	});

}]);