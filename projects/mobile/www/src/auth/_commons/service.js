(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthService', AuthService);

    /*@ngInject*/
    function AuthService($db, $remote, $q, $http, $timeout) {

        return {

            login: function(credentials) {

                var deferred = $q.defer();

                $db.delete("_token");

                // TODO REMOTE CALL
                // $http
                //   .post('_server_login', credentials)
                //   .then(function(response) {
                //       $db.setObject("_token", response.data.access_token);
                //       deferred.resolve();
                //     },
                //     function(response) {
                //       deferred.reject({
                //         message: "Failed to authenticate",
                //         details: "Please try again",
                //       });
                //     });

                $timeout(function() {

                    deferred.resolve({
                        error: false,
                        data: {
                            access_token: "e72e16c7e42f292c6912e7710c838347ae178b4a",
                        },
                    });
                    //
                    // deferred.reject({
                    //   message: "Failed to authenticate",
                    //   details: "Please try again",
                    // });

                }, 3000);

                return deferred.promise;

            },

            logoff: function() {

                $db.delete("_user");

            }

        };

    }

}());
