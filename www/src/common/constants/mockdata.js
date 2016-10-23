(function () {
    'use strict';

    angular
        .module('app')
        .constant('MockData', {
            Tabs: [{
                _id: '1c4422ac-8ddc-4a04-99ef-3f5831c447d2',
                title: 'Desert Stevia',
                date: "2016-05-18",
                members: [
                    "Santiago Mills",
                    "Jordan Graham",
                    "Molly Jennings",
                    "Kelly Hoffman",
                ],
                shares: 6,
            }, {
                _id: '9e5e22ac-8ddc-4a04-99ef-3f5831c447d2',
                title: 'Mountain Neverest',
                date: "2016-01-18",
                members: [
                    "Jordan Graham",
                    "Molly Jennings",
                    "Kelly Hoffman",
                    "Jackie Tate",
                    "Ronald Casey",
                    "Bethany Martin",
                    "Calvin Myers",
                    "Greg Horton",
                    "Santiago Mills",
                    "Tommie Drake",
                ],
                shares: 10,
            }, {
                _id: 'bc521186-effb-45e6-bf16-d8c25addfed2',
                title: 'Space Oddity',
                date: "2016-06-18",
                members: [
                    "Patsy Cruz",
                    "Inez Lewis",
                    "Shane Scott",
                    "Robert Zimmerman",
                    "Kelly Powers",
                    "Benjamin Bowen",
                    "Darlene Russell",
                    "Gerald Payne",
                ],
                shares: 15,
            }],
        });


})();
