angular.module('refenes.services', [])

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

.factory('GroupsService', function($http) {

	return {
		all: function() {

			var promise = $http
				.get('/data/groups.json')
				.then(function(response) {
					return response.data;
				});

			return promise;

		}
	};

})

.factory('NotesService', function($http, FriendsService, $q) {

	var self = this;
	var deferred = $q.defer();

	self.all = function() {

		$http
			.then(function(response) {
				var promises = [];
				var notes = response.data.data.notes;


				angular.forEach(notes, function(note,index) {

					var promise = FriendsService.one().then(function(results) {
						notes[index].user = results.user;
						console.log("notes", index)
					});

					promises.push(promise);

				});


				$q.all(promises).then(function() {

					console.log("resolved", notes.length)

					deferred.resolve(notes);
				});

			});

		return deferred.promise;

	};

	return self;

})


.service('Incomes', function(Projects, $q) {

	var self = this;

	var deferred = $q.defer();
	var incomes = [];

	self.buildAndGetIncomes = function() {

		Projects.async().then(function(d) {
			var projects = d;

			angular.forEach(projects, function(project) {

				if (typeof(project.account.accountAmount) == 'number' && project.account.accountAmount > 0) {
					var newIncome = {};
					newIncome.projectName = project.projectName;
					newIncome.clientName = project.clientName;
					newIncome.typeIncome = "Accompte";
					newIncome.amount = project.account.amountAccount;
					newIncome.date = project.account.accountDate;
					newIncome.notes = project.account.accountType;
					incomes.push(newIncome);
				}
			});

			angular.forEach(projects, function(project) {


				if (typeof(project.total.totalAmount) == 'number' && project.total.totalAmount > 0) {
					var newIncome = {};
					newIncome.projectName = project.projectName;
					newIncome.clientName = project.clientName;
					newIncome.typeIncome = "Accompte";
					newIncome.amount = project.total.totalAmount;
					newIncome.date = project.total.totalDate;
					newIncome.notes = project.total.totalType;
					incomes.push(newIncome);
				}
			});

			deferred.resolve(incomes);
		});

		return deferred.promise;
	};
});
