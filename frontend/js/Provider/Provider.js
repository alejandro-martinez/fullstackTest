"use strict";

angular.module('FullstackApp.Provider',[])
.factory('ProviderFct', function() {

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
})
.service('ProviderSvc',function( $http ) {
	this.providers = [];
	var That = this;

	this.getAll = function() { 
		var promise = new Promise(
			function( resolve, reject) {
				if ( That.providers.length ) {
					resolve( That.providers);
				}
				else {
					$http.get('/providers').then(function(res) {
						That.providers = res.data;
						resolve( res.data)
					}).catch(reject);
				}
			}
		);
		return promise;
	}
	this.delete = function( provider ) { return $http.delete('/providers/' + provider.id) }
	this.save = function( provider ) {
		var promise = new Promise(
			function( resolve, reject ) {
				$http.post('/providers/:id', provider).then(resolve, reject); 
			}
		);
		return promise;
	}
	this.getAll = this.getAll.bind( this );
})
.controller('ProviderCtrl',function( $scope, ProviderSvc, ProviderFct ) {

	angular.extend($scope, {
		providers: [],
		newProvider: ProviderFct.new()
	});
	
	$scope.saveProvider = function( provider ) {
		ProviderSvc.save( provider ).then(function( res ){
			if (!provider.id) {
				$scope.providers.push( res.data.model );
				$scope.newProvider.name = "";
			}
			$scope.$emit('providersChange', $scope.providers);
		}).catch( function( err ) {
			$scope.showError( err.data );
		});

	}

	// Adds a new provider
	$scope.addProvider = function() {
		if ( $scope.newProvider.name.length ) $scope.saveProvider( $scope.newProvider );
	}

	// Updates a provider's name
	$scope.editProvider = function( provider ) {
		var name = prompt("Enter the provider's name", provider.name);
		if ( angular.isString( name ) && name.length ) {
			provider.name = name;
			$scope.saveProvider( provider );
		}
	}

	// Deletes a provider
	$scope.deleteProvider = function( provider ) {
		if (confirm("Are you sure you want to delete the provider: ".concat(provider.name,"?"))) {
			ProviderSvc.delete( provider ).then(function( res ) {
				var i = $scope.providers.indexOf( provider );
				$scope.providers.splice(i, 1);
				$scope.$emit('providersChange', $scope.providers);
			});
		}
	}

	// Loads the provider's list
	ProviderSvc.getAll().then(function( providers ) {
		$scope.providers = providers;		
		$scope.$emit('providersChange', providers);
	}).catch(function( res ) {
		$scope.showError( res.data.err );
	})
});