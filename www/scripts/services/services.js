angular.module('refenes.services')

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
