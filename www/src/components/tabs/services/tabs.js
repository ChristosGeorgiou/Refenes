(function() {
  'use strict';

  angular
    .module('refenes.tabs')
    .factory('Tabs', Tabs);

  Tabs.$inject = ['DB', '$q'];

  function Tabs(DB, $q) {

    var service = {
      All: All
    };

    return service;

    function All() {
      return DB.Get("tabs");
    }

  }


}());
