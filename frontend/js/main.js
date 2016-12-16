"use strict";

angular.module('FullstackApp', [
  'FullstackApp.Client',
  'FullstackApp.Provider',
  'ngRoute'
])
.directive('modalWindow', function() {
	return {
		restrict: 'E',
		scope: {
		 	show: '='
		},
		replace: true,
		transclude: true,
		link: function(scope, element, attrs) {
			scope.show = false;
			scope.hideModal = function() {
				scope.show = false;
			};
		},
		templateUrl: 'js/modalWindow.html' 
	};
});