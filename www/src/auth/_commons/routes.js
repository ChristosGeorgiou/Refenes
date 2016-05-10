(function() {
    'use strict';

    angular
        .module('app')
        .config(states);

    /*@ngInject*/
    function states($stateProvider) {

        $stateProvider
            .state('auth.login', {
                url: "/login",
                templateUrl: "src/auth/auth.login/view.html",
                controller: 'LoginController',
            })
            .state('auth.register', {
                url: "/register",
                templateUrl: "src/auth/auth.register/view.html",
                controller: 'RegisterController',
            });

    }

})();
