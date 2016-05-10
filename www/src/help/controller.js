(function() {
    'use strict';

    angular
        .module('app')
        .controller('HelpController', HelpController);

    /*@ngInject*/
    function HelpController($scope, $ionicModal) {

        $ionicModal.fromTemplateUrl('src/help/view.html', {
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
    }

})();
