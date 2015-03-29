angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});
