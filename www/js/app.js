angular.module('refenes', ['ionic', 'refenes.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/_main.html",
    controller: 'AppCtrl',
  })

  .state('app.notes', {
    url: "/notes",
    views: {
      'content': {
        templateUrl: "templates/notes.html",
      }
    }
  })

  .state('app.groups', {
    url: "/groups",
    views: {
      'content': {
        templateUrl: "templates/groups.html",
        controler: "GroupsCtrl",
      }
    }
  })

  .state('app.groups.detail', {
    url: "/{contactId:[0-9]{1,4}}",
    views: {
      'content': {
        templateUrl: "templates/group_view.html",
      }
    }
  })

  .state('app.groups.new', {
    url: "/new",
    views: {
      'content': {
        templateUrl: "templates/group_form.html",
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/notes');
});
