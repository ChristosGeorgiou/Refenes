(function() {
    'use strict';

    angular
        .module('app')
        .controller('TabsTabsController', TabsTabsController);

    /*@ngInject*/
    function TabsTabsController($scope) {

        var vm = this;

        vm.refresh = refresh;

        activate();

        function activate() {
            refresh();
        }

        function refresh() {

            vm.tabs = [{
                id: "a1tre1sdf",
                title: "Vacations 05/15",
                created: moment().subtract(88, "days").fromNow(),
            }, {
                id: "jkbn645n",
                title: "Party 02/15",
                created: moment().subtract(188, "days").fromNow(),
            }];

            $scope.$broadcast('scroll.refreshComplete');

        }

    }

}());
