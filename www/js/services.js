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


        angular.forEach(notes, function(note, index) {

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

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars,callback) {
			var _this =this;
      var validators = {
        config: function() {
					return $db.getObject("_config");
        },
        user: function() {
					return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if(!validators[vars[i]]()){
					callback();
				}
      }
    },
    init: function($scope) {

      var config = $db.getObject("_config");

      if (!config) {
        $scope.status = "Initializing...";
        console.log("Empty application");
        $timeout(function() {
          $scope.status = "Loading...";
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_config", config.data);
                deferred.resolve(config.data);
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;
    },
    user: function($scope) {
      return $db.getObject("_user") || false;
    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.143:9999/";

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
          return response;
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
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  }
});
