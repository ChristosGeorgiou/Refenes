angular.module('refenes.services')

.factory('$config', function($db, $remote, $q, $timeout) {

	var deferred = $q.defer();

	return {
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

		setup: function($scope) {

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

.factory('$remote', function($http) {

	var _server = "http://192.168.3.105:9999/";

	return {
		fetch: function(item) {
			return $http
				.get(_server + item)
				.then(function(response) {
					if (response.error) {
						console.log("Remote Data Error", response.data);
					} else {
						console.log("Loaded Data[" + item + "]", item);
					}
					return response.data;
				}, function(response) {
					//console.log("response",response);
					var errorStatus;
					if (response.status === 0) {
						errorStatus = 'Could not connect to server<br>Check your internet connectivity';
					} else if (response.status == 401) {
						errorStatus = 'Unauthorized';
					} else if (response.status == 405) {
						errorStatus = 'HTTP verb not supported [405]';
					} else if (response.status == 500) {
						errorStatus = 'Internal Server Error [500].';
					} else {
						errorStatus = JSON.parse(JSON.stringify(response.data.error));
					}

					return {
						error: true,
						data: errorStatus
					};
				});
		},
		custom: function(item) {
			switch (item) {
				case "users":
					console.log("Users list requested");
					var promise = $http
						.get('http://api.randomuser.me/?results=10')
						.then(function(response) {
							return response.data.results;
						});
					return promise;
			}
		}
	};
})

.factory('$db', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		delete: function(key) {
			$window.localStorage.removeItem(key);
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
		}
	};
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
	var deferred = $q.defer();
	return {
		notes: {
			all: function() {
				$timeout(function() {
					$remote
						.fetch($config.user().username)
						.then(function(userdb) {
							if (userdb.error) {
								deferred.reject({
									msg: 'Could not load userdata<br>from remote server.',
									info: userdb.data,
								});
							} else {
								deferred.resolve(userdb.data.notes);
							}
						});
				}, 1000);

				return deferred.promise;

			}
		}
	};

})

.factory('FriendsService', function($http) {

	return {
		one: function() {

			var promise = $http
				.get('http://api.randomuser.me')
				.then(function(response) {
					return response.data.results[0];
				});

			return promise;

		},
		all: function() {

			var promise = $http
				.get('http://api.randomuser.me/?results=10')
				.then(function(response) {
					return response.data.results;
				});

			return promise;

		}
	};

})

.factory('GroupsService', function($http, $db) {

	return {
		all: function() {
			return $db.getObject("groups");
		}
	};

});
