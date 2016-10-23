(function () {
    'use strict';

    angular
        .module('app')
        .factory('TabsService', TabsService);

    /*@ngInject*/
    function TabsService($q, DB) {

        var service = {
            InitShare: InitShare
        };

        return service;

        function InitShare(tab) {

            var _n = {
                _id: DB.IDGen(),
                date: new Date(),
                isEqual: true,
                amount_given: 0,
                amount_taken: 0,
                equalShare: 0,
                payers: [],
                takers: [],
            };

            var i = 0,
                len = tab.members.length;
            for (; i < len; i++) {
                _n.payers.push({
                    name: tab.members[i].name,
                    amount: 0,
                });
                _n.takers.push({
                    name: tab.members[i].name,
                    amount: 0,
                });
            }

            return _n;

        }

    }


} ());
