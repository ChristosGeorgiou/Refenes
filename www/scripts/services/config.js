angular.module('refenes.services')

.factory('$config', function($db, $remote, $q, $http, $timeout) {

	var deferred = $q.defer();

	return {

		init: function() {
			return $http
				.get("config.json")
				.then(function(response) {
					$db.setObject("_config", response.data);
					return {
						error: false,
						message: "Configuration loaded",
						details: response.data
					};
				}, function(response) {
					return {
						error: true,
						message: "Configuration could not load",
						details: response.status
					};
				});
		},

		connectivity: function() {
			return $http
				.get($db.getObject("_config").server)
				.then(function() {
					return {
						error: false,
						message: "Connection test succeed"
					};
				}, function() {
					return {
						error: true,
						message: "Connection with server failed",
						details: "Check your internet connectivity"
					};
				});
		},

	};

})
