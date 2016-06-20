(function() {
    'use strict';

    angular
        .module('app')
        .controller('TabsTabController', TabsTabController);

    /*@ngInject*/
    function TabsTabController($scope, $stateParams, DB, $q, $ionicLoading, $ionicPopover, $ionicModal, $ionicActionSheet) {

        var _id = $stateParams.id;

        $scope.SelectNote = SelectNote;

        InitTab();
        InitModal();

        function InitTab() {

            $scope.loading = true;

            $q
                .when()
                .then(function() {
                    return $ionicLoading.show({
                        template: 'Loading...'
                    });
                })
                .then(function() {
                    return DB.db.tabs
                        .get(_id)
                        .then(function(data) {
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
                .then(function() {
                    return DB.db.notes
                        .allDocs({
                            include_docs: true,
                        })
                        .then(function(data) {

                            $scope.notes = _.chain(data.rows)
                                .filter(function(item) {
                                    return item.doc.tab == _id;
                                })
                                .sortBy(function(item) {
                                    return item.doc.date;
                                })
                                .value()
                                .reverse();

                            var i = 0,
                                leni = $scope.notes.length;
                            for (; i < leni; i++) {
                                var _n = $scope.notes[i].doc,
                                    j = 0,
                                    lenj = _n.givers.length;
                                for (; j < lenj; j++) {
                                    var _k = _n.givers[j].name;
                                    $scope.owns[_k].amount += parseFloat(_n.givers[j].amount) - parseFloat(_n.takers[j].amount);
                                }
                            }

                        })
                        .catch(function() {
                            $ionicLoading.hide();
                        });
                })
                .then(function() {
                    $scope.loading = false;
                    $ionicLoading.hide();
                });
        }

        function SelectNote(doc) {

            $ionicActionSheet
                .show({
                    buttons: [{
                        text: 'Επεξεργασία'
                    }],
                    destructiveText: 'Διαγραφή',
                    // titleText: 'Select ',
                    cancelText: 'Άκυρο',
                    // cancel: function() {
                    //     // add cancel code..
                    // },
                    buttonClicked: function(index) {
                        switch (index) {
                            case 0:
                                $scope.note = angular.copy(doc);
                                _showNote();
                                break;
                            default:
                        }
                        return true;
                    },
                    destructiveButtonClicked: function() {
                        DB.db.notes.remove(doc);
                        InitTab();
                        return true;
                    },
                });
        }

        function InitModal() {
            $ionicModal
                .fromTemplateUrl('src/tabs/share.form/view.html', {
                    scope: $scope
                })
                .then(function(modal) {
                    $scope.modal = modal;
                });

            $scope.CloseNote = function() {
                $scope.modal.hide();
            };

            $scope.NewNote = function() {
                $scope.note = _initNote();
                _showNote();
            };

            $scope.SaveNote = function() {

                $scope.modal.hide();

                $scope.loading = true;

                $scope.note.tab = _id;

                DB.db.notes.put($scope.note)
                    .then(function(response) {
                        InitTab();
                    }).catch(function(err) {
                        console.log(err);
                    });


            };


        }

        function _showNote() {

            $scope.$watch("note", function(newNote, oldNote) {

                $scope.note.amount_given = _.reduce(newNote.givers, function(memo, giver) {
                    var _a = 0;
                    if (giver.amount) {
                        _a = parseFloat(giver.amount);
                    }
                    return memo + _a;
                }, 0).toFixed(2);

                $scope.note.amount_taken = _.reduce(newNote.takers, function(memo, taker) {
                    var _a = 0;
                    if (taker.amount) {
                        _a = parseFloat(taker.amount);
                    }
                    return memo + _a;
                }, 0).toFixed(2);

                _.each(newNote.givers, function(giver) {
                    parseFloat(giver.amount).toFixed(2);
                });

                if (newNote.isEqual) {
                    newNote.equalShare = (newNote.amount_given / newNote.takers.length).toFixed(2);
                    _.each(newNote.takers, function(taker) {
                        taker.amount = newNote.equalShare;
                    });
                }

            }, true);

            $scope.modal.show();
        }

        function _initNote() {

            var _n = {
                _id: DB.IDGen(),
                date: new Date(),
                isEqual: true,
                amount_given: 0,
                amount_taken: 0,
                equalShare: 0,
                givers: [],
                takers: [],
            };

            var i = 0,
                len = $scope.tab.members.length;
            for (; i < len; i++) {
                _n.givers.push({
                    name: $scope.tab.members[i].name,
                    amount: 0, //Math.round(Math.random() * 100),
                });
                _n.takers.push({
                    name: $scope.tab.members[i].name,
                    amount: 0,
                });
            }

            return _n;

        }

    }


}());
