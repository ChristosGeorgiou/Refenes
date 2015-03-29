angular.module('refenes.controllers')

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

	$scope.refreshNotes = function() {

		$data.notes.all().then(function(notes) {
			$scope.notes = notes;
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
		}, function(error) {
			$scope.error = error;
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
		});
	};

	$scope.newNote = function() {};

	$ionicLoading.show({
		templateUrl: 'templates/_partials/loading.html',
		noBackdrop: true,
	});
	$scope.refreshNotes();
});
