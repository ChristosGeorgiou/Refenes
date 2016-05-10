(function() {
    'use strict';

    angular
        .module('app')
        .factory('DashboardService', DashboardService);

    /*@ngInject*/
    function DashboardService($q, TabsService, FriendsService) {
        var service = {
            Load: Load
        };

        return service;

        function Load() {
            var _activities = [];

            var defer = $q.defer();
            var promises = [];

            promises.push(_LoadTabs());
            promises.push(_LoadFriends());

            $q.all(promises)
                .then(function() {
                    _.sortBy(_activities, "Date");
                    _activities = _activities.reverse();
                    defer.resolve(_activities);
                });
                
            return defer.promise;
        }

        function _LoadTabs() {

            return TabsService
                .All()
                .then(function(tabs) {
                    _parseTabs(tabs);
                });

        }

        function _LoadFriends() {
            return FriendsService
                .All()
                .then(function(friends) {
                    _parseFriends(friends);
                });
        }

        function _parseTabs(tabs) {
            angular.forEach(tabs, function(tab) {

                if (tab.RemovedAt) {
                    _activities.push({
                        "Icon": "ion-bonfire",
                        "Color": "assertive",
                        "Description": "Removed " + tab.description + " tab by " + tab.RemovedBy.Name,
                        "Date": tab.RemovedAt,
                    });
                }
                _activities.push({
                    "Icon": "ion-bonfire",
                    "Color": "positive",
                    "Description": "Added " + tab.Description + " tab by " + tab.CreatedBy.Name,
                    "Date": tab.CreatedAt,
                });

                if (tab.expences) {
                    _parseExpences(tab);
                }

            });
        }

        function _parseExpences(tab) {
            angular.forEach(tab.expences, function(expence) {
                if (expence.RemovedAt) {
                    _activities.push({
                        "Icon": "ion-flame",
                        "Color": "assertive",
                        "Description": "Removed expence of " + expence.Ammount + " to " + tab.Description + " tab with a " + expence.Share + " share",
                        "Date": expence.RemovedAt,
                    });
                }
                _activities.push({
                    "Icon": "ion-flame",
                    "Color": "positive",
                    "Description": "Added expence of " + expence.Ammount + " to " + tab.Description + " tab with a " + expence.Share + " share",
                    "Date": expence.CreatedAt,
                });
            });
        }

        function _parseFriends(friends) {
            angular.forEach(friends, function(friend) {
                if (!friend.IsAccepted) {
                    _activities.push({
                        "Icon": "ion-user",
                        "Color": "positive",
                        "Description": "Friend request send at " + friend.Name,
                        "Date": friend.RequestAt,
                    });
                }
                _activities.push({
                    "Icon": "ion-user",
                    "Color": "positive",
                    "Description": "Added " + friend.Name + "as a friend",
                    "Date": friend.AcceptedAt,
                });
            });
        }

    }

}());
