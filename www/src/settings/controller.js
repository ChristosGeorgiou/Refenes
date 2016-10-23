(function() {
    'use strict';

    angular
        .module('app')
        .controller('SettingsController', SettingsController);

    /*@ngInject*/
    function SettingsController($scope, DB, $ionicPopup, $ionicHistory) {

        $ionicHistory.clearHistory();

        $scope.clear = function() {
            DB.Clear();
            $ionicPopup.alert({
                title: 'Database cleared!',
                template: 'Oh my'
            });
        };

        $scope.mock = function() {
            DB.Mock();
            $ionicPopup.alert({
                title: 'Database Mocked!',
                template: 'It might taste good'
            });
        };


    }

}());
