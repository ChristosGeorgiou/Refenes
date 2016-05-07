(function() {
    'use strict';

    angular
      .module('refenes')
      .factory('DB', DB);

    DB.$inject = ['$window', '$q'];

    function DB($window, $q) {
      var service = {
        _prefix: "DB_",
        _lastSync: null,
        _isOnline: false,
        Set: Set,
        Get: Get,
        Delete: Delete
      };

      return service;

      function Set(key, object) {
        service
          ._sync()
          .then(function() {
            $window.localStorage[service._prefix + key] = JSON.stringify(object);
          })
      }

      function Get(key, excludeUnsync) {
        excludeUnsync = typeof excludeUnsync !== 'undefined' ? excludeUnsync : 'default_b';
        return service
          ._sync()
          .then(function() {
            (!$window.localStorage[service._prefix + key]) ? false: JSON.parse($window.localStorage[service._prefix + key] || '{}');
          })
      }

      function Delete(key) {
        $window.localStorage.removeItem(service._prefix + key);
      }

      function _sync() {

        return $http
          .post(angular.Settings.Service + "/sync", {
            data: service.Get("tabs").Changes
          })
          .then(function(response) {
            service.Set("tabs", response.data)
          }, function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      }

    }
  }

}());
