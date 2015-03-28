angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.set("_settings", false);
    $db.set("_user", false);
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.load_settings($scope).then(function(){
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

.controller('LoginCtrl', function($scope, $config , $state, $ionicHistory) {
  $ionicHistory.clearHistory();

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    console.log("credientials", $scope.credientials);
    $state.go('app.notes');
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

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal

  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/_partials/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('NotesCtrl', function($scope, $ionicModal, NotesService, $ionicLoading) {

  $scope.refreshNotes = function() {
    NotesService.all().then(function(data) {
      console.log("data", data)
      $scope.notes = data;
      $scope.$broadcast('scroll.refreshComplete')
      $ionicLoading.hide()
    }).catch(function(error) {
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

});
