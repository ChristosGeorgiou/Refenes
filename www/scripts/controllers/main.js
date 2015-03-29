angular.module('refenes.controllers')

.controller('AppCtrl', function($scope, $config, $state) {

	$config.validate(["config", "user"], function() {
		$state.go('start');
	});

});
