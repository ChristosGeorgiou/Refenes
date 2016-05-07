(function() {
    'use strict';

    angular
			.module('refenes.auth')
			.controller('LoginController', LoginController);

		LoginController.$inject = [$state, AuthService];

    function LoginController($state, AuthService) {

        var vm = this;
        vm.Login = Login;
        vm.Offline = Offline;

        activate();

        function activate() {
						if(angular.Settings.MockUser){
							vm.Credientials = angular.Settings.MockData.UserCredientials;
						}
        }

        function Login() {
					vm.loading = true;
					AuthService
			      .Login(vm.Credientials)
						.then(function() {
							$state.go('app.dashboard');
						}, function(reason) {
							vm.error = reason;
						})
						.finally(function(){
							vm.loading = false;
						});

        }

        function Offline() {
					AuthService
						.Offline()
						.then(function() {
							$state.go('app.dashboard');
						});
            
        }
    }
}());
