'use strict';

angular.module('refenes.auth')

.config(function($stateProvider) {
	$stateProvider

  	.state('auth.login', {
  		url: "/login",
  		templateUrl: "src/components/auth/views/login.html",
  		controller: 'LoginController',
  	})

  	.state('auth.register', {
  		url: "/register",
  		templateUrl: "src/components/auth/views/register.html",
  		controller: 'RegisterController',
  	})

})
