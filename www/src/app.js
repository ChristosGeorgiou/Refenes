(function() {
    'use strict';

    angular
        .module('app', [
            'ionic',
            'ngResource',
        ])
        .run(run);

    /*@ngInject*/
    function run($ionicPlatform, DB) {

        DB.Init();

        $ionicPlatform.ready(function() {

            // if (window.cordova && window.cordova.plugins.Keyboard) {
            //     window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            // }
            if (window.StatusBar) {
                window.StatusBar.styleDefault();
            }
        });

    }

}());
