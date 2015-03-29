angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});
