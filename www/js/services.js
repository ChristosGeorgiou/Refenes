angular.module('refenes.services', [])

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

.factory('GroupsService', function($http) {

	return {
		all: function() {

			var promise = $http
				.get('/data/groups.json')
				.then(function(response) {
					return response.data;
				});

			return promise;

		}
	};

})

.factory('NotesService', function($http, FriendsService, $q) {

	var self = this;
	var deferred = $q.defer();

	self.all = function() {

		$http
			.get('/data/notes.json')
			.then(function(response) {

				var promises = [];

				var notes = response.data;


				angular.forEach(notes, function(note,index) {

					var promise = FriendsService.one().then(function(results) {
						notes[index].user = results.user;
						console.log("notes", index)
					});

					promises.push(promise);

				});


				$q.all(promises).then(function() {

					console.log("resolved", notes.length)

					deferred.resolve(notes);
				});

			});

		return deferred.promise;

	};

	return self;

})

.factory('$db', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
