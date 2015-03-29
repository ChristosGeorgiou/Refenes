angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});
