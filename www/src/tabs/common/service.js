(function() {
    'use strict';

    angular
        .module('app')
        .factory('TabsService', TabsService);

    /*@ngInject*/
    function TabsService($state, $ionicModal, DB) {

        var _scope;

        var service = {

            Init: Init,
            Open: Open,
        };

        return service;

        function Init(scope) {
            _scope = scope;

            $ionicModal
                .fromTemplateUrl('src/tabs/new/view.html', {
                    scope: scope,
                    animation: 'slide-in-up'
                })
                .then(function(modal) {
                    _scope.modal_refenes = modal;

                    _scope.modal_refenes.data = {
                        title: null,
                        members: [],
                    };

                    _scope.modal_refenes.Close = Close;
                    _scope.modal_refenes.Save = Save;
                    _scope.modal_refenes.AddMember = AddMember;
                    _scope.modal_refenes.RemoveMember = RemoveMember;
                });

            // // Cleanup the modal when we're done with it!
            // _scope.$on('$destroy', function() {
            //     _scope.modal_refenes.remove();
            // });
            // Execute action on hide modal
            _scope.$on('modal.hidden', function() {
                // Execute action
            });
            // Execute action on remove modal
            _scope.$on('modal.removed', function() {
                // Execute action
            });


        }

        function Open(data) {
            _scope.modal_refenes.show();
        }

        function Close() {
            _scope.modal_refenes.hide();
        }

        function Save() {

            var _id = DB.Add(_scope.modal_refenes.data);

            $state.go("app.tab", {
                id: _id
            });
            
            Close();

        }

        function AddMember() {
            console.log("asd");
            _scope.modal_refenes.data.members.push({
                name: null
            });
        }

        function RemoveMember(i) {
            _scope.modal_refenes.data.members.splice(i, 1);
        }


    }


}());
