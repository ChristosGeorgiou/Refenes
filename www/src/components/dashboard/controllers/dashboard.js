(function() {
  'use strict';

  angular
    .module('refenes.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$log', 'DB'];

  function DashboardController($state, $log, DB) {

    var vm = this;
    vm.getActivities = getActivities;

    activate();

    function activate() {
      return getActivities();
    }

    function getActivities() {
      return Activity.Load()
        .then(function(Items) {
          vm.Items = Items;
          vm.$broadcast('scroll.refreshComplete');
        }, function(error) {
          $scope.error = error;
        })
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

  }
}());
