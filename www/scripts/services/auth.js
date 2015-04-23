angular.module('refenes.services')

.factory('$auth', function($db, $remote, $q, $http, $timeout) {

	var deferred = $q.defer();

	return {

		user: function() {

			return $db.getObject("_user") || false;

		},

		login: function(credentials) {

			$remote
				.login(credentials)
				.then(function(user) {
					if (userdb.error) {
						
						var TEMP_USER = {
							"userid": 999,
							"username": "christos",
						};

						$db.setObject("_user", TEMP_USER);



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
