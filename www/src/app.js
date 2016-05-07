'use strict';

angular.module('refenes.controllers',[])
angular.module('refenes.services',[])
angular.module('refenes', [
'ionic',
'ngResourse',
'refenes.auth',
'refenes.dashboard',
'refenes.tabs',
'refenes.controllers',
'refenes.services'
])

.run(function($ionicPlatform, Client, Settings) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			window.StatusBar.styleDefault();
		}
	});

	Client.Init();
	angular.Settings = Settings;
})

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

		.state('auth', {
			abstract: true,
			templateUrl: "src/layouts/empty.html",
		})

	.state('app', {
		abstract: true,
		templateUrl: "src/layouts/default.html",
	})

	.state('app.groups', {
		url: "/groups",
		views: {
			'content': {
				templateUrl: "views/groups/groups.html",
				controller: "GroupsCtrl",
			}
		}
	})

	.state('app.groups.detail', {
		url: "/{contactId:[0-9]{1,4}}",
		views: {
			'content': {
				templateUrl: "views/groups/group_view.html",
			}
		}
	})

	.state('app.groups.new', {
		url: "/new",
		views: {
			'content': {
				templateUrl: "views/groups/group_form.html",
			}
		}
	})

	.state('app.friends', {
			url: "/friends",
			views: {
				'content': {
					templateUrl: "views/friends/friends.html",
					controller: "FriendsCtrl"
				}
			}
		})
		.state('app.settings', {
			url: "/settings",
			views: {
				'content': {
					templateUrl: "views/settings/list.html",
					controller: "SettingsCtrl"
				}
			}
		});

	// if none of the above states are matched, use this as the fallback

	$urlRouterProvider.otherwise('/dashboard');
});
