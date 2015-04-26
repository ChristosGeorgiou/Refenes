angular.module('refenes.controllers')

.controller('LoginCtrl', function($scope, $auth, $state, $ionicHistory) {

	$ionicHistory.clearHistory();

	$scope.credientials = {
		identity:"christos",
		password:"1234",
	};

	$scope.login = function() {
		$scope.loading = true;
		$scope.status = "Sign in<br>Please wait...";
		$auth.login($scope.credientials)
			.then(function() {
				$state.go('app.notes');
			}, function(reason) {
				$scope.loading = false;
				$scope.error = reason;
			});

	};

});
