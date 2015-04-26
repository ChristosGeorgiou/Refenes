angular.module('refenes.services')

.factory('$remote', function($http, $q, $http, $timeout ) {

	var deferred = $q.defer();

	return {
		
		get: function(method,params) {
			return $http
				.get([$db.getObject("config").server,method,params.join("/")].join("/"))
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
