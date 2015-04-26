angular.module('refenes.controllers')

.controller('StartCtrl', function($scope, $config, $q, $timeout, $ionicHistory, $state) {

	$ionicHistory.clearHistory();

	$scope.init = function() {

		var config = $config.init();
		//var connectivity = $config.connectivity();

		$scope.loading = true;
		$scope.status = "Loading...";

		//$q.all([config, connectivity])
		$q.all([config])
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

	$scope.init();

});
