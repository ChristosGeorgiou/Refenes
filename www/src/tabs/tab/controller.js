(function() {
    'use strict';

    angular
        .module('app')
        .controller('TabsTabController', TabsTabController);

    /*@ngInject*/
    function TabsTabController($scope, $stateParams, DB, $q, $ionicLoading, $ionicPopover) {

        var _id = $stateParams.id;

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
                    .get(_id)
                    .then(function(data) {
                        $scope.tab = data;

                        $scope.owns = {};

                        var i = 0,
                            len = $scope.tab.members.length;
                        for (; i < len; i++) {
                            $scope.owns[$scope.tab.members[i]] = {
                                name: $scope.tab.members[i],
                                amount: 0
                            };
                        }

                    });
            })
            .then(function() {
                return DB.db.notes
                    .allDocs({
                        include_docs: true,
                    })
                    .then(function(data) {

                        $scope.notes = _.chain(data.rows)
                            .filter(function(item) {
                                return item.doc.tab == _id;
                            })
                            .sortBy(function(item) {
                                return item.doc.date;
                            })
                            .value()
                            .reverse();

                        var i = 0,
                            leni = $scope.notes.length;
                        for (; i < leni; i++) {
                            var _n = $scope.notes[i].doc,
                                j = 0,
                                lenj = _n.shares.length;
                            for (; j < lenj; j++) {
                                var _k = _n.shares[j].name;
                                $scope.owns[_k].amount += _n.shares[j].amount;
                            }
                        }

                    })
                    .catch(function() {
                        $ionicLoading.hide();
                    });
            })
            .then(function() {
                $scope.loading = false;
                $ionicLoading.hide();
            });

        $ionicPopover
            .fromTemplateUrl('src/tabs/tab/more.html', {
                scope: $scope
            })
            .then(function(popover) {
                $scope.popover = popover;
            });

        $scope.ShowDetails = function(note,$event) {
            $scope.details = note;
            $scope.popover.show($event);
        };

    }


}());
