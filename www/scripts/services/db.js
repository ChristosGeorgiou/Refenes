angular.module('refenes.services')

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
			return (!$window.localStorage[key]) ? false : JSON.parse($window.localStorage[key] || '{}');
		}
	};
})
