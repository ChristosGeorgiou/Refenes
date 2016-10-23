(function () {
    'use strict';

    angular
        .module('app')
        .controller('TabsTabsController', TabsTabsController);

    /*@ngInject*/
    function TabsTabsController($state, $scope, DB, $q, $ionicLoading, $ionicHistory, $ionicModal) {

        $ionicHistory.clearHistory();

        $scope.loading = true;

        $q
            .when()
            .then(function () {
                return $ionicLoading.show({
                    template: 'Loading...'
                });
            })
            .then(function () {
                return DB.db.tabs
                    .allDocs({
                        include_docs: true,
                    })
                    .then(function (data) {
                        $scope.tabs = data.rows;
                    });
            })
            .then(function () {
                $scope.loading = false;
                $ionicLoading.hide();
            });


        $ionicModal
            .fromTemplateUrl('src/tabs/tab.new/view.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
            .then(function (modal) {
                $scope.modal = modal;
            });



        $scope.Open = function () {
            $scope.tab = {
                title: null,
                members: [],
            };
            $scope.modal.show();
        };

        $scope.Close = function () {
            $scope.modal.hide();
        };

        $scope.Save = function () {
            var _t = angular.copy($scope.tab);
            _t.date = new Date();
            DB.db.tabs
                .put(_t)
                .then(function (resp) {
                    $state.go("app.tab", {
                        id: resp.id,
                    });
                    $scope.modal.hide();
                })
                .catch(function (err) {
                    console.log(err);
                });
        };

        $scope.AddMember = function () {
            $scope.tab.members.push({
                name: null
            });
        };

        $scope.RemoveMember = function (i) {
            $scope.tab.members.splice(i, 1);
        };


    }

} ());
