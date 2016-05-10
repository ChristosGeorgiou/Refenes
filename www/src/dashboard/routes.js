(function() {
    'use strict';

    angular
        .module('app')
        .config(states);

    /*@ngInject*/
    function states($stateProvider) {

        $stateProvider
            .state('app.dashboard', {
                url: "/dashboard",
                views: {
                    'content': {
                        templateUrl: "src/dashboard/view.html",
                        controller: "DashboardController",
                    }
                }
            });

    }

})();
