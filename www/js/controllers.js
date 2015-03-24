angular.module('starter.controllers', [])

.controller('DashboardCtrl', function($scope) {

})

.controller('SettingsCtrl', function($scope) {

})

.controller('GroupsCtrl', function($scope) {

})

.controller('AccountsCtrl', function($scope) {

})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
