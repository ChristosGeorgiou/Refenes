(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    /*@ngInject*/
    function DashboardController($scope, DashboardService, MockData) {

        $scope.Refresh = Refresh;

        Refresh();

        function Refresh() {
            console.log("refreshing dashboard");
            return DashboardService
                .Load()
                .then(function(items) {
                    $scope.Items = items;
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    $scope.error = error;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

    }

}());
