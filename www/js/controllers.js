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

})

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

})

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

})

.controller('AppCtrl', function($scope, $config, $state) {
  $config.validate(["config", "user"], function() {
    $state.go('start');
  });
})

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete')
      $ionicLoading.hide()
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete')
      $ionicLoading.hide()
    });
  };

  $scope.newNote = function() {}

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
})

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete')
      $ionicLoading.hide()
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete')
      $ionicLoading.hide()
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

})

.controller('FriendsCtrl', function($scope, FriendsService, $ionicLoading, $ionicActionSheet, $timeout) {

  // Triggered on a button click, or some other target
  // $scope.menuFriend = function() {
  //
  // 	// Show the action sheet
  // 	var hideSheet = $ionicActionSheet.show({
  // 		buttons: [{
  // 			text: '<i class="icon ion-paper-airplane"></i> Send a Note',
  // 		}, {
  // 			text: '<i class="icon ion-person"></i> View Profile'
  // 		}],
  // 		cancelText: 'Cancel',
  // 		cancel: function() {
  // 			// add cancel code..
  // 		},
  // 		buttonClicked: function(index) {
  // 			return true;
  // 		}
  // 	});
  //
  // 	// For example's sake, hide the sheet after two seconds
  // 	$timeout(function() {
  // 		hideSheet();
  // 	}, 7000);
  //
  // };

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete')
      $ionicLoading.hide()
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete')
      $ionicLoading.hide()
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

})

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});
