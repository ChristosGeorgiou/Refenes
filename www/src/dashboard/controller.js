(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    /*@ngInject*/
    function DashboardController($scope, DashboardService) {

        var vm = this;
        vm.getActivities = getActivities;

        activate();

        function activate() {
            return getActivities();
        }

        function getActivities() {
            return DashboardService
                .Load()
                .then(function(Items) {
                    vm.Items = Items;
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
