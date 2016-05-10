(function() {
    'use strict';

    angular
        .module('app')
        .factory('TabsService', TabsService);

    /*@ngInject*/
    function TabsService($q) {

        var service = {
            All: All
        };

        return service;

        function All() {
            return $q.resolve([]);//DB.Get("tabs");
        }

    }


}());
