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
                cache: false,
            })
            .state('app.tab', {
                url: "/tabs/:id",
                templateUrl: "src/tabs/tab.view/view.html",
                controller: "TabsTabController",
                cache: false,
            });

    }

}());
