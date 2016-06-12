(function() {
    'use strict';

    angular
        .module('app')
        .config(states);

    /*@ngInject*/
    function states($stateProvider) {

        $stateProvider
            .state('app.tabs', {
                url: "/tabs",
                templateUrl: "src/tabs/tabs/view.html",
                controller: "TabsTabsController",
                controllerAs: "vm",
            })
            .state('app.tab', {
                url: "/tab/:id",
                templateUrl: "src/tabs/tab/view.html",
                controller: "TabsTabController",
                controllerAs: "vm",
            });

    }

}());
