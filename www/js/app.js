angular.module('refenes', ['ionic', 'refenes.controllers', 'refenes.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }


  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('start', {
    url: "/start",
    templateUrl: "templates/general/start.html",
    controller: 'StartCtrl',
  })

  .state('login', {
    url: "/login",
    templateUrl: "templates/general/login.html",
    controller: 'LoginCtrl',
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/_layouts/main.html",
    controller: 'AppCtrl',
  })

  .state('app.notes', {
    url: "/notes",
    views: {
      'content': {
        templateUrl: "templates/notes/notes.html",
        controller: "NotesCtrl",
      }
    }
  })

  .state('app.groups', {
    url: "/groups",
    views: {
      'content': {
        templateUrl: "templates/groups/groups.html",
        controller: "GroupsCtrl",
      }
    }
  })

  .state('app.groups.detail', {
    url: "/{contactId:[0-9]{1,4}}",
    views: {
      'content': {
        templateUrl: "templates/groups/group_view.html",
      }
    }
  })

  .state('app.groups.new', {
    url: "/new",
    views: {
      'content': {
        templateUrl: "templates/groups/group_form.html",
      }
    }
  })

  .state('app.friends', {
    url: "/friends",
    views: {
      'content': {
        templateUrl: "templates/friends/friends.html",
        controller: "FriendsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});
