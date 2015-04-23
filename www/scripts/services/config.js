angular.module('refenes.services')

.factory('$config', function($db, $remote, $q, $http, $timeout) {

	var deferred = $q.defer();

	return {

		init: function() {
			return $http
				.get("config.json")
				.then(function(response) {
					$db.setObject("config", response.data);
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
			var config = $db.getObject("config");

			return $http
				.get(config.server)
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

		fetch: function() {

			var config = $db.getObject("_settings");

			if (!config) {
				$scope.status = "Initializing...";
				$timeout(function() {
					$remote
						.fetch("_appConfig")
						.then(function(config) {
							if (config.error) {
								deferred.reject({
									msg: 'Could not load config<br>from remote server.',
									info: config.data,
								});
							} else {
								$db.setObject("_settings", config.data);
								deferred.resolve();
							}
						});
				}, 1000);
			} else {
				deferred.resolve(config);
			}

			return deferred.promise;

		},

		validate: function(vars, callback) {

			var validators = {
				config: function() {
					return $db.getObject("_settings");
				},
				user: function() {
					return $db.getObject("_user");
				},
			};

			for (var i = 0; i < vars.length; i++) {
				if (!validators[vars[i]]()) {
					callback();
				}
			}

		},

		user: function() {

			return $db.getObject("_user") || false;

		},

		login: function($scope) {

			//TODO REAL LOGIN

			var TEMP_USER = {
				"userid": 999,
				"username": "christos",
			};

			$scope.status = "Loading data<br>Please wait...";

			$db.setObject("_user", TEMP_USER);
			$remote
				.fetch(TEMP_USER.username)
				.then(function(userdb) {
					if (userdb.error) {
						deferred.reject({
							msg: 'User not found',
							info: userdb.data,
						});
					} else {

						angular.forEach(userdb.data, function(data, index) {
							$db.setObject(index, data);
						});

						deferred.resolve();
					}
				});


			return deferred.promise;
		},

		logoff: function() {

			$db.delete("_user");

		}
	};

})
