angular.module('refenes.controllers')

.controller('LoginCtrl', function($scope, $auth, $state, $ionicHistory) {

	$ionicHistory.clearHistory();

	$scope.credientials = {};
	$scope.login = function() {
		$scope.loading = true;
		$scope.status = "Sign in<br>Please wait...";
		$auth.login($scope.credientials)
			.then(function() {
				$state.go('app.notes');
			}, function(reason) {
				$scope.loading = false;
				$scope.error = reason.msg;
			});

	};

})
