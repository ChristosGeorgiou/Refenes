angular.module('refenes.controllers')

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
