(function() {
    'use strict';

    angular
        .module('app')
        .controller('TabsTabsController', TabsTabsController);

    /*@ngInject*/
    function TabsTabsController($scope, DB, TabsService, $q, $ionicLoading, $ionicHistory) {

        $ionicHistory.clearHistory();

        $scope.loading = true;

        $q
            .when()
            .then(function() {
                return $ionicLoading.show({
                    template: 'Loading...'
                });
            })
            .then(function() {
                return DB.db.tabs
                    .allDocs({
                        include_docs: true,
                    })
                    .then(function(data) {
                        $scope.tabs = data.rows;
                    });
            })
            .then(function() {
                $scope.loading = false;
                $ionicLoading.hide();
            });

        TabsService.Init($scope);

        $scope.OpenNewRefenes = function() {
            TabsService.Open();
        };

    }

}());
