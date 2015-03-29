angular.module('refenes.controllers')

.controller('HelpCtrl', function($scope, $ionicModal) {

	$ionicModal.fromTemplateUrl('views/_partials/help.html', {
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

});
