(function () {
    'use strict';

    angular
        .module('app')
        .factory('DB', DB);

    /*@ngInject*/
    function DB($q, MockData) {

        var _db_name = "refenes";


        var service = {
            db: {},
            Init: Init,
            Mock: Mock,
            Clear: Clear,
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
                .then(function () {
                    return service.db.friends.destroy();
                })
                .then(function () {
                    return service.db.tabs.destroy();
                })
                .then(function () {
                    return service.db.shares.destroy();
                })
                .then(function () {
                    Init();
                });
        }

        function Mock() {

            $q
                .when()
                .then(function () {
                    return Clear();
                })
                .then(function () {
                    //console.log("MOCK:TABS", MockData.Tabs);
                    return service.db.tabs.bulkDocs(MockData.Tabs);
                })
                .then(function () {

                    var _shares = [];
                    for (var i = 0; i < MockData.Tabs.length; i++) {
                        for (var j = 0; j < MockData.Tabs[i].shares; j++) {
                            _shares.push(MockShare(MockData.Tabs[i]._id, MockData.Tabs[i].members.length));
                        }
                    }
                    // console.log("MOCK:SHARES", _shares);

                    return service.db.shares.bulkDocs(_shares);

                });

        }

        function MockShare(TabId, MembersLength) {
            var lorem = [
                'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
                'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
                'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
                'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
                'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis',
                'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
                'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
                'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
                'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
                'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
            ];

            var _share = {
                tab_id: TabId,
                description: lorem[_.random(lorem.length - 1)] + " " + lorem[_.random(lorem.length - 1)],
                date: moment().subtract(_.random(100), 'days').toDate(),
                equal: (_.random(1)),
                given: Math.round(parseFloat(((_.random(100, 1000) / _.random(5, 20)) * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2),
                taken: Math.round(parseFloat(((_.random(100, 1000) / _.random(5, 20)) * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2),
                givers: [],
                takers: [],
            };

            var _index = 0;
            var _left = _share.given;
            var _am = 0;
            while (_index++ < MembersLength) {
                _am = _.random(_left);
                _left -= _am;
                _left = Math.round(parseFloat((_left * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
                _share.givers.push(Math.round(parseFloat((_am * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2));
            }

            if (_left > 0) {
                _share.givers[MembersLength - 1] += _left;
                _share.givers[MembersLength - 1] = Math.round(parseFloat((_share.givers[MembersLength - 1] * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
            }

            if (_share.equal) {
                for (var i = 0; i < MembersLength; i++) {
                    _share.takers.push(Math.round(parseFloat(((_share.given / MembersLength) * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2));
                }
            }
            else {
                var _index2 = 0;
                var _left2 = _share.given;
                var _am2 = 0;
                while (_index2++ < MembersLength) {
                    _am2 = _.random(_left2);
                    _left2 -= _am2;
                    _left2 = Math.round(parseFloat((_left2 * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
                    _share.takers.push(Math.round(parseFloat((_am2 * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2));
                }
                if (_left2 > 0) {
                    _share.takers[MembersLength - 1] += _left2;
                    _share.takers[MembersLength - 1] = Math.round(parseFloat((_share.takers[MembersLength - 1] * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);

                }
            }

            return _share;
        }

    }


} ());
