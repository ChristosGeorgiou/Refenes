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
                views: {
                    'content': {
                        templateUrl: "src/tabs/tabs.list/view.html",
                        controller: "TabsListController",
                    }
                }
            })
            .state('app.tabs.detail', {
                url: "/{contactId:[0-9]{1,4}}",
                views: {
                    'content': {
                        templateUrl: "src/tabs/tab.details/view.html",
                    }
                }
            })
            .state('app.tabs.new', {
                url: "/new",
                views: {
                    'content': {
                        templateUrl: "src/tabs/tab.new/view.html",
                    }
                }
            });

    }

}());
