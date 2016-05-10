(function() {
    'use strict';

    angular
        .module('app')
        .factory('FriendsService', FriendsService);

    /*@ngInject*/
    function FriendsService($q) {

        var service = {
            All: All
        };

        return service;

        function All() {
            return $q.resolve([]);//DB.Get("tabs");
        }

    }


}());
