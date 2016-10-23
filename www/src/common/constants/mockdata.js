(function() {
    'use strict';

    angular
        .module('app')
        .constant('MockData', {
            Shares: [{
                id: 487,
                person: {
                    avatar: "https://randomuser.me/api/portraits/women/72.jpg",
                    name: "Soula",
                },
                date: moment().subtract(1, "days").toDate(),
                date_label: moment().subtract(1, "days").fromNow(),
                amount: 14.12,
                type: "RECEIVED",
                tab: "MyGroup",
            }, {
                id: 6578,
                person: {
                    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
                    name: "Sakis",
                },
                date: moment().subtract(2, "days").toDate(),
                date_label: moment().subtract(2, "days").fromNow(),
                amount: 50.67,
                type: "RECEIVED",
                tab: "MyGroup",
            }, {
                id: 6578,
                person: {
                    avatar: "https://randomuser.me/api/portraits/men/72.jpg",
                    name: "Christos",
                },
                date: moment().subtract(5, "days").toDate(),
                date_label: moment().subtract(5, "days").fromNow(),
                amount: 150.22,
                type: "SEND",
                tab: "MyGroup",
            }, {
                id: 6578,
                person: {
                    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
                    name: "Makis",
                },
                date: moment().subtract(15, "days").toDate(),
                date_label: moment().subtract(15, "days").fromNow(),
                amount: 100.00,
                type: "RECEIVED",
                tab: "PRIVATE"
            }]
        });
})();
