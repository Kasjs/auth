(function () {
	'use strict';
	angular.module('rssreader').controller('AuthController', ['$scope', '$state', 'authService', '$window', 'dashboardService','$auth','$location', function ($scope, $state, authService, $window, dashboardService, $auth, $location) {
		$scope.user = {};
		$scope.session;

		var ERRORS = {
			field_required: 'This field is required',
			email_example: 'Please, use example: jacksparrow@gmail.com',
			char_num6_required: 'Please, enter at least 6 characters',
			char_num9_required: 'Please, enter at least 9 characters',
			char_num20_required: 'Please, enter at least 20 characters'
		}

		$scope.register = function (form) {
			//        console.log($scope.user);
			if (form.validate()) {
				authService.register($scope.user).error(function (error) {
					$scope.error = error;
				}).then(function () {
					console.log(authService.userID());
					$state.go('dashboard.' + dashboardService.getViewMode(), {
						id: authService.userID()
					});
				});
			}
		};

		$scope.logIn = function (form) {
			if (form.validate()) {
				authService.logIn($scope.user, $scope.session).error(function (error) {
					$scope.error = error;
				}).then(function () {
					if (!$scope.session) {
						//                    console.log("Not checked");
						$scope.onExit = function () {
							auth.logOut();
						};
						$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
						});
						$window.onbeforeunload = $scope.onExit;
					} else {
						$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
						});
					}
				});
			}
		};
		$scope.authenticate = function (provider) {
			$auth.authenticate(provider).then(function(response){
				console.log(response.data.token);
				console.log($auth.getToken());
				authService.saveToken(response.data.token);
				$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
				});
			})
		};

		$scope.validationLoginOptions = {
			rules: {
				mail: {
					required: true,
					email: true
				},
				pwd: {
					required: true
				}
			},
			messages: {
				mail: {
					required: ERRORS.field_required,
					email: ERRORS.email_example
				},

				pwd: {
					required: ERRORS.field_required
				}
			}
		};

		$scope.validationRegistrOptions = {
			rules: {
				mail: {
					required: true,
					email: true,
					minlength: 9,
					maxlength: 20,
				},
				pwd: {
					required: true,
					minlength: 6,
					maxlength: 20,
				},
				reppwd: {
					required: true,
					minlength: 6,
					maxlength: 20,
				}
			},
			messages: {
				mail: {
					required: ERRORS.field_required,
					email: ERRORS.email_example,
					minlength: ERRORS.char_num9_required,
					maxlength: ERRORS.char_num20_required
				},

				pwd: {
					required: ERRORS.field_required,
					minlength: ERRORS.char_num6_required,
					maxlength: ERRORS.char_num20_required
				},

				reppwd: {
					required: ERRORS.field_required,
					minlength: ERRORS.char_num6_required,
					maxlength: ERRORS.char_num20_required
				}
			}
		}
}]);
})();