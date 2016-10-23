(function () {
    'use strict';

    angular
        .module('app')
        .config(states);

    /*@ngInject*/
    function states($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/dashboard');

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: "src/common/views/layout.html",
            });

    }

} ());
