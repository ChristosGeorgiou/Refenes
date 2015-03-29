(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');

    console.log("ASD");
  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');

    console.log("ASD");
  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes', [
  'ionic',
  'refenes.controllers',
  'refenes.services'])

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
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings/list.html",
        controller: "SettingsCtrl"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/start');
});

angular.module('refenes.controllers', [])

.controller('AppCtrl', function($scope, $config, $state) {

  $config.validate(["config", "user"], function() {
    $state.go('start');


  });

});

angular.module('refenes.controllers', [])

.controller('FriendsCtrl', function(
  $scope,
  FriendsService,
  $ionicLoading) {

  $scope.refreshFriends = function() {
    FriendsService.all().then(function(data) {
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.refreshFriends();

});

angular.module('refenes.controllers', [])

.controller('GroupsCtrl', function($scope, $ionicModal, GroupsService, $ionicLoading) {

  $scope.doRefresh = function() {
    GroupsService.all().then(function(data) {
      $scope.groups = data;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }).catch(function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $ionicModal.fromTemplateUrl('templates/groups/group_form.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.newGroup = function() {
    $scope.modal.show();
  };

  $scope.closeGroup = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });

  $scope.doRefresh();

});

angular.module('refenes.controllers', [])

.controller('HelpCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/_partials/help.html', {
      scope: $scope
    })
    .then(function(modal) {
      $scope.helpModal = modal;
    });

  $scope.showHelpModal = function() {
    $scope.helpModal.show();
  };

  $scope.hideHelpModal = function() {
    $scope.helpModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.helpModal.remove();
  });

});

angular.module('refenes.controllers', [])

.controller('LoginCtrl', function($scope, $config, $state, $ionicHistory) {
  $ionicHistory.clearHistory();
  $scope.$broadcast('scroll.refreshComplete');

  $config.validate(["config"], function() {
    $state.go('start');
  });

  if ($config.user()) {
    $state.go('app.notes');
  }

  $scope.credientials = {};
  $scope.login = function() {
    $scope.loading = true;
    $scope.status = "Sign in<br>Please wait...";
    $config.login($scope).then(function() {
      $state.go('app.notes');
    }, function(reason) {
      $scope.loading = false;
      $scope.error = reason.msg;
    });

  };

});

angular.module('refenes.controllers', [])

.controller('NotesCtrl', function($scope, $ionicModal, $ionicLoading, $data) {

  $scope.refreshNotes = function() {

    $data.notes.all().then(function(notes) {
      $scope.notes = notes;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    }, function(error) {
      $scope.error = error;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });
  };

  $scope.newNote = function() {};

  $ionicLoading.show({
    templateUrl: 'templates/_partials/loading.html',
    noBackdrop: true,
  });
  $scope.refreshNotes();
});

angular.module('refenes.controllers', [])

.controller('SettingsCtrl', function($scope, $config, $state) {
  $scope.Logoff = function() {
    $config.logoff();
    $state.go("login");
  };
});

angular.module('refenes.controllers', [])

.controller('StartCtrl', function($scope, $config, $timeout, $state, $ionicHistory, $db) {

  $ionicHistory.clearHistory();

  $scope.initApp = function() {

    //####
    $scope.status = "FORCEINIT";
    $db.delete("_settings");
    $db.delete("_user");
    //####

    $scope.loading = true;
    $scope.status = "Loading...";

    if (!$config.settings) {
      $scope.status = "Loading Settings<br>Please wait...";
      $config.setup($scope).then(function() {
        $state.go('login');
      }, function(reason) {
        $scope.loading = false;
        $scope.error = reason.msg;
        $scope.info = reason.info;
      });
    }

  };

  $scope.initApp();

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

},{}]},{},[1])
angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

},{}]},{},[1])
angular.module('refenes.services', [])

.factory('$config', function($db, $remote, $q, $timeout) {

  var deferred = $q.defer();

  return {
    validate: function(vars, callback) {

      var validators = {
        config: function() {
          return $db.getObject("_settings");
        },
        user: function() {
          return $db.getObject("_user");
        },
      };

      for (var i = 0; i < vars.length; i++) {
        if (!validators[vars[i]]()) {
          callback();
        }
      }

    },

    setup: function($scope) {

      var config = $db.getObject("_settings");

      if (!config) {
        $scope.status = "Initializing...";
        $timeout(function() {
          $remote
            .fetch("_appConfig")
            .then(function(config) {
              if (config.error) {
                deferred.reject({
                  msg: 'Could not load config<br>from remote server.',
                  info: config.data,
                });
              } else {
                $db.setObject("_settings", config.data);
                deferred.resolve();
              }
            });
        }, 1000);
      } else {
        deferred.resolve(config);
      }

      return deferred.promise;

    },

    user: function() {

      return $db.getObject("_user") || false;

    },

    login: function($scope) {

      //TODO REAL LOGIN

      var TEMP_USER = {
        "userid": 999,
        "username": "christos",
      };

      $scope.status = "Loading data<br>Please wait...";

      $db.setObject("_user", TEMP_USER);
      $remote
        .fetch(TEMP_USER.username)
        .then(function(userdb) {
          if (userdb.error) {
            deferred.reject({
              msg: 'User not found',
              info: userdb.data,
            });
          } else {

            angular.forEach(userdb.data, function(data, index) {
              $db.setObject(index, data);
            });

            deferred.resolve();
          }
        });


      return deferred.promise;
    },

    logoff: function() {

      $db.delete("_user");

    }
  };

})

.factory('$remote', function($http) {

  var _server = "http://192.168.1.133:9999/";

  return {
    fetch: function(item) {
      return $http
        .get(_server + item)
        .then(function(response) {
          if (response.error) {
            console.log("Remote Data Error", response.data);
          } else {
            console.log("Loaded Data[" + item + "]", item);
          }
          return response.data;
        }, function(response) {
          //console.log("response",response);
          var errorStatus;
          if (response.status === 0) {
            errorStatus = 'Could not connect to server<br>Check your internet connectivity';
          } else if (response.status == 401) {
            errorStatus = 'Unauthorized';
          } else if (response.status == 405) {
            errorStatus = 'HTTP verb not supported [405]';
          } else if (response.status == 500) {
            errorStatus = 'Internal Server Error [500].';
          } else {
            errorStatus = JSON.parse(JSON.stringify(response.data.error));
          }

          return {
            error: true,
            data: errorStatus
          };
        });
    },
    custom: function(item) {
      switch (item) {
        case "users":
          console.log("Users list requested");
          var promise = $http
            .get('http://api.randomuser.me/?results=10')
            .then(function(response) {
              return response.data.results;
            });
          return promise;
      }
    }
  };
})

.factory('$db', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    delete: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log($window.localStorage[key]);
      return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$data', function($db, $config, $remote, $q, $timeout) {
  var deferred = $q.defer();
  return {
    notes: {
      all: function() {
        $timeout(function() {
          $remote
            .fetch($config.user().username)
            .then(function(userdb) {
              if (userdb.error) {
                deferred.reject({
                  msg: 'Could not load userdata<br>from remote server.',
                  info: userdb.data,
                });
              } else {
                deferred.resolve(userdb.data.notes);
              }
            });
        }, 1000);

        return deferred.promise;

      }
    }
  };

})

.factory('FriendsService', function($http) {

  return {
    one: function() {

      var promise = $http
        .get('http://api.randomuser.me')
        .then(function(response) {
          return response.data.results[0];
        });

      return promise;

    },
    all: function() {

      var promise = $http
        .get('http://api.randomuser.me/?results=10')
        .then(function(response) {
          return response.data.results;
        });

      return promise;

    }
  };

})

.factory('GroupsService', function($http, $db) {

  return {
    all: function() {
      return $db.getObject("groups");
    }
  };

});

},{}]},{},[1])