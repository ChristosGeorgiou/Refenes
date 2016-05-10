(function() {
    'use strict';

    angular
        .module('app')
        .config(states);

    /*@ngInject*/
    function states($stateProvider) {

        $stateProvider
            .state('app.settings', {
                url: "/settings",
                views: {
                    'content': {
                        templateUrl: "src/settings/view.html",
                        controller: "SettingsController"
                    }
                }

            });
    }

}());
