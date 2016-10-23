(function() {
    'use strict';

    angular
        .module('app')
        .factory('DB', DB);

    /*@ngInject*/
    function DB($q) {

        var _db_name = "refenes";


        var service = {
            db: {},
            Init: Init,
            MockData: MockData,
            Clear: Clear,
            IDGen:IDGen,
        };

        return service;


        function Init() {
            service.db.friends = new PouchDB("friends");
            service.db.tabs = new PouchDB("tabs");
            service.db.shares = new PouchDB("shares");

            if (APP.Debug) {
                PouchDB.debug.enable('*');
            }

        }

        function Clear() {
            return $q
                .when()
                .then(function() {
                    return service.db.friends.destroy();
                })
                .then(function() {
                    return service.db.tabs.destroy();
                })
                .then(function() {
                    return service.db.shares.destroy();
                })
                .then(function() {
                    Init();
                });
        }

        function MockData() {

            $q
                .when()
                .then(function() {
                    return Clear();
                })
                .then(function() {
                    return service.db.tabs.bulkDocs([{
                        _id: '5ae21r3a',
                        title: 'Ταξίδι στην Κρήτη',
                        date: "2016-01-18",
                        members: ["aa", "bb", "cc", "dd"],
                        shares: 2,
                    }, {
                        _id: '9887ssfv',
                        title: 'Space Oddity',
                        date: "2016-06-18",
                        members: ["aa", "bb", "cc", "dd"],
                        shares: 0,
                    }]);
                })
                .then(function() {
                    return service.db.shares.bulkDocs([{
                        tab: '5ae21r3a',
                        description: 'Σουβλάκια',
                        amount: 40,
                        date: "2016-01-19",
                        shares: [{
                            name: "aa",
                            amount: 40
                        }, {
                            name: "aa",
                            amount: -10
                        }, {
                            name: "bb",
                            amount: -10
                        }, {
                            name: "cc",
                            amount: -10
                        }, {
                            name: "dd",
                            amount: -10
                        }]
                    }, {
                        tab: '5ae21r3a',
                        description: 'Ποτά',
                        amount: 120,
                        date: "2016-01-28",
                        shares: [{
                            name: "bb",
                            amount: 60
                        }, {
                            name: "aa",
                            amount: 40
                        }, {
                            name: "cc",
                            amount: 20
                        }, {
                            name: "aa",
                            amount: -10
                        }, {
                            name: "bb",
                            amount: -40
                        }, {
                            name: "cc",
                            amount: -40
                        }, {
                            name: "dd",
                            amount: -30
                        }]
                    }]);
                });

        }


        function IDGen() {
            return Math.floor((1 + Math.random()) * 0x10000000).toString(16);
        }

    }


}());
