(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    /*@ngInject*/
    function DashboardController($state, $scope, DB, $q, $ionicLoading, $ionicHistory) {

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
                return DB.db.notes
                    .allDocs({
                        include_docs: true,
                    })
                    .then(function(data) {

                        $scope.notes = _.chain(data.rows)
                            .sortBy(function(item) {
                                return item.doc.date;
                            })
                            .first(10)
                            .value()
                            .reverse();

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
            

    }

}());
