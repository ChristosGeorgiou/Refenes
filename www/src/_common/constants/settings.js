(function() {
    'use strict';

    angular
        .module('app')
        .constant("Settings", {
            "Service": "http://192.168.3.103:9999",
            "MockUser": true,
            "MockData": {
                "UserCredientials": {
                    Identity: "christos",
                    Password: "1234",
                }
            }
        });

})();
