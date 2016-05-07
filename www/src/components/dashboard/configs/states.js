'use strict';

angular.module('refenes.auth')

.config(function($stateProvider) {
	$stateProvider


		.state('app.dashboard', {
			url: "/dashboard",
			views: {
				'content': {
					templateUrl: "views/notes/dashboard.html",
					controller: "DashboardController",
				}
			}
		})


})
