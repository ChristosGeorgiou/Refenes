(function () {
    'use strict';

    angular
        .module('app')
        .controller('TabsTabController', TabsTabController);

    /*@ngInject*/
    function TabsTabController(TabsService, $scope, $stateParams, DB, $q, $ionicLoading, $ionicPopover, $ionicModal, $ionicActionSheet, ionicDatePicker) {

        var _id = $stateParams.id;

        $scope.SelectShare = SelectShare;

        InitTab();
        InitShareModal();

        function InitTab() {

            $q
                .when()
                .then(function () {
                    return DB.db.tabs
                        .get(_id)
                        .then(function (data) {
                            $scope.tab = data;

                            $scope.owns = [];

                            var i = 0,
                                len = $scope.tab.members.length;
                            for (; i < len; i++) {
                                $scope.owns.push(0);
                            }

                        });
                })
                .then(function () {
                    return DB.db.shares
                        .allDocs({
                            include_docs: true,
                        })
                        .then(function (data) {

                            $scope.shares = _.chain(data.rows)
                                .filter(function (item) {
                                    return item.doc.tab_id == _id;
                                })
                                .sortBy(function (item) {
                                    return item.doc.date;
                                })
                                .value()
                                .reverse();

                            var i = 0,
                                leni = $scope.shares.length;

                            for (; i < leni; i++) {
                                var _n = $scope.shares[i].doc,
                                    j = 0,
                                    lenj = _n.givers.length;
                                for (; j < lenj; j++) {
                                    $scope.owns[j] += parseFloat(_n.givers[j]) - parseFloat(_n.takers[j]);
                                }
                            }

                            $scope.tamount_diff = _.reduce($scope.owns, function (memo, num) { return memo + num; }, 0);
                            $scope.tamount_is_off = ($scope.tamount_diff > 0.01 || $scope.tamount_diff < -0.01);

                        });
                });
        }

        function SelectShare(doc) {

            $ionicActionSheet
                .show({
                    buttons: [{
                        text: 'Edit'
                    }],
                    destructiveText: 'Delete',
                    // titleText: 'Select ',
                    cancelText: 'Cancel',
                    // cancel: function() {
                    //     // add cancel code..
                    // },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                $scope.share = angular.copy(doc);
                                OpenShareForm();
                                break;
                            default:
                        }
                        return true;
                    },
                    destructiveButtonClicked: function () {
                        DB.db.shares.remove(doc);
                        InitTab();
                        return true;
                    },
                });
        }

        function InitShareModal() {
            $ionicModal
                .fromTemplateUrl('src/tabs/share.form/view.html', {
                    scope: $scope
                })
                .then(function (modal) {
                    $scope.modal = modal;
                });

            $scope.CloseShare = function () {
                $scope.modal.hide();
            };

            $scope.NewShare = function () {
                $scope.share = TabsService.InitShare($scope.tab);
                OpenShareForm();
            };

            $scope.OpenDatePicker = function () {

                ionicDatePicker.openDatePicker({
                    callback: function (val) {  //Mandatory
                        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    },
                    // disabledDates: [            //Optional
                    //     new Date(2016, 2, 16),
                    //     new Date(2015, 3, 16),
                    //     new Date(2015, 4, 16),
                    //     new Date(2015, 5, 16),
                    //     new Date('Wednesday, August 12, 2015'),
                    //     new Date("08-16-2016"),
                    //     new Date(1439676000000)
                    // ],
                    from: new Date(2012, 1, 1), //Optional
                    to: new Date(2016, 10, 30), //Optional
                    inputDate: new Date(),      //Optional
                    mondayFirst: true,          //Optional
                    disableWeekdays: [0],       //Optional
                    closeOnSelect: false,       //Optional
                    templateType: 'popup'       //Optional
                });
            };

            $scope.SaveShare = function () {

                $scope.modal.hide();

                $scope.loading = true;

                $scope.share.tab = _id;

                DB.db.shares.put($scope.share)
                    .then(function (response) {
                        InitTab();
                    }).catch(function (err) {
                        console.log(err);
                    });


            };


        }

        function OpenShareForm() {

            $scope.$watch("share", function (newShare, oldShare) {

                $scope.share.given = _.reduce(newShare.givers, function (memo, giver) {
                    var _a = 0;
                    if (giver) {
                        _a = parseFloat(giver);
                    }
                    return memo + _a;
                }, 0).toFixed(2);

                $scope.share.taken = _.reduce(newShare.takers, function (memo, taker) {
                    var _a = 0;
                    if (taker) {
                        _a = parseFloat(taker);
                    }
                    return memo + _a;
                }, 0).toFixed(2);

                $scope.amount_diff = $scope.share.given - $scope.share.taken;
                $scope.amount_is_off = ($scope.amount_diff > 0.01 || $scope.amount_diff < -0.01);

                _.each(newShare.givers, function (giver) {
                    parseFloat(giver).toFixed(2);
                });

                if (newShare.equal || (oldShare.equal && !newShare.equal)) {
                    newShare.equalShare = (newShare.given / newShare.takers.length).toFixed(2);
                    _.each(newShare.takers, function (taker) {
                        taker = parseFloat(newShare.equalShare);
                    });
                }

            }, true);

            $scope.modal.show();
        }


    }


} ());
