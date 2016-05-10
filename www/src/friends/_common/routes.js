(function() {
    'use strict';

    angular
        .module('app')
        .config(states);

    /*@ngInject*/
    function states($stateProvider) {

        $stateProvider
            .state('app.friends', {
                url: "/friends",
                views: {
                    'content': {
                        templateUrl: "src/friends/view.html",
                        controller: "FriendsController"
                    }
                }
            });
    }

}());
