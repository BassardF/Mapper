var app = angular.module('app', ['ngRoute', 'ngCookies', 'storageServiceModule', 'mapServiceModule'])

.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider.
	when('/mapper', {
		templateUrl: 'Mapper/app/views/mapper.html',
		controller: 'MapperController'
	}).
	otherwise({
		redirectTo: '/mapper'
	});

	$locationProvider.html5Mode(true);
	
}])