angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
	// Form data for the login modal

	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
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


	$ionicModal.fromTemplateUrl('templates/help.html', {
			scope: $scope
		})
		.then(function(modal) {
			$scope.helpModal = modal;
		});

	$scope.showHelpModal = function() {
		$scope.helpModal.show()
	};

	$scope.hideHelpModal = function() {
		$scope.helpModal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.helpModal.remove();
	});

})

.controller('PlaylistsCtrl', function($scope) {
	$scope.playlists = [{
		title: 'Reggae',
		id: 1
	}, {
		title: 'Chill',
		id: 2
	}, {
		title: 'Dubstep',
		id: 3
	}, {
		title: 'Indie',
		id: 4
	}, {
		title: 'Rap',
		id: 5
	}, {
		title: 'Cowbell',
		id: 6
	}];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})

.controller('GroupsCtrl', function($scope, $ionicModal) {

	$ionicModal.fromTemplateUrl('templates/group_form.html', {
			scope: $scope
		})
		.then(function(modal) {
			$scope.modal = modal;
		});

	$scope.newGroup = function() {
		$scope.modal.show()
	};

	$scope.closeGroup = function() {
		$scope.modal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

});
