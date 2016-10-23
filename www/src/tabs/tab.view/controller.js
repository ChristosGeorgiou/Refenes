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

                            $scope.owns = {};

                            var i = 0,
                                len = $scope.tab.members.length;
                            for (; i < len; i++) {
                                $scope.owns[$scope.tab.members[i].name] = {
                                    name: $scope.tab.members[i].name,
                                    amount: 0
                                };
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
                                    return item.doc.tab == _id;
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
                                    lenj = _n.payers.length;
                                for (; j < lenj; j++) {
                                    var _k = _n.payers[j].name;
                                    $scope.owns[_k].amount += parseFloat(_n.payers[j].amount) - parseFloat(_n.takers[j].amount);
                                }
                            }

                        })
                        .catch(function () {
                            $ionicLoading.hide();
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

                $scope.share.amount_given = _.reduce(newShare.payers, function (memo, payer) {
                    var _a = 0;
                    if (payer.amount) {
                        _a = parseFloat(payer.amount);
                    }
                    return memo + _a;
                }, 0).toFixed(2);

                $scope.share.amount_taken = _.reduce(newShare.takers, function (memo, taker) {
                    var _a = 0;
                    if (taker.amount) {
                        _a = parseFloat(taker.amount);
                    }
                    return memo + _a;
                }, 0).toFixed(2);

                $scope.amount_diff = $scope.share.amount_given - $scope.share.amount_taken;
                $scope.amount_is_off = ($scope.amount_diff > 0.01 || $scope.amount_diff < -0.01);

                _.each(newShare.payers, function (payer) {
                    parseFloat(payer.amount).toFixed(2);
                });

                if (newShare.isEqual || (oldShare.isEqual && !newShare.isEqual)) {
                    newShare.equalShare = (newShare.amount_given / newShare.takers.length).toFixed(2);
                    _.each(newShare.takers, function (taker) {
                        taker.amount = parseFloat(newShare.equalShare);
                    });
                }

            }, true);

            $scope.modal.show();
        }


    }


} ());
