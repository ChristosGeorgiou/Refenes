(function() {
    'use strict';

    angular
        .module('app')
        .run(run);

    /*@ngInject*/
    function run($ionicPlatform, Settings) {

        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                window.StatusBar.styleDefault();
            }
        });

        angular.Settings = Settings;

    }

}());
