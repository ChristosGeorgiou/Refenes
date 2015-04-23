angular.module('refenes.controllers')

.controller('StartCtrl', function($scope, $config, $q, $timeout, $ionicHistory, $state) {

	$ionicHistory.clearHistory();

	$scope.initApp = function() {

		var config = $config.init(),
			connectivity = $config.connectivity()

		$scope.loading = true;
		$scope.status = "Loading...";

		$q.all([config, connectivity])
			.then(function(results) {

				var _error = false;
				angular.forEach(results, function(result, key) {
					if (result.error) {
						$scope.loading = false;
						$scope.error = result;
						_error = true;
						return;
					} else {
						console.log(result);
					}
				});

				if (!_error) {
					$state.go('login');
				}

			});
	};

	$scope.initApp();

});
