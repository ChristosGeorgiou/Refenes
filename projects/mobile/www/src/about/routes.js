(function() {
    'use strict';

    angular
        .module('app')
        .config(states);

    /*@ngInject*/
    function states($stateProvider) {

        $stateProvider
            .state('app.about', {
                url: "/about",
                templateUrl: "src/about/view.html"
            });
    }

}());
