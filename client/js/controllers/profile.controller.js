(function () {
	'use strict';
	angular.module('rssreader')
		.controller('ProfileController', ['Upload', '$http', '$state', 'profileService', '$scope',
        'authService', '$window', 'themeService', 'dashboardService', '$auth', 'Account', 'toastr',

        function (Upload, $http, $state, profileService, $scope,
				authService, $window, themeService, dashboardService, $auth, Account, toastr) {


				$scope.getProfile = function () {
					Account.getProfile()
						.then(function (response) {
							$scope.user = response.data;
						})
				};
				$scope.updateProfile = function () {
					Account.updateProfile($scope.user)
						.then(function () {
							console.log('Profile has been updated');
						})
						.catch(function (response) {
							console.log(response.data.message, response.status);
						});
				};
				$scope.link = function (provider) {
					$auth.link(provider)
						.then(function () {
							console.log('You have successfully linked a ' + provider + ' account');
							$scope.getProfile();
						})
						.catch(function (response) {
							console.log(response.data.message, response.status);
						});
				};
				$scope.unlink = function (provider) {
					$auth.unlink(provider)
						.then(function () {
							console.log('You have unlinked a ' + provider + ' account');
							$scope.getProfile();
						})
						.catch(function (response) {
							toastr.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
						});
				};

				$scope.getProfile();









				$scope.submit = function () {
					console.log($scope.file);
					if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
						$scope.upload($scope.file); //call upload function
					}
				}

				$scope.upload = function (file) {
					Upload.upload({
						url: 'http://localhost:8080/upload', //webAPI exposed to upload the file
						headers: {
							Authorization: 'Bearer ' + authService.getToken()
						},
						data: {
							file: file
						} //pass file as data, should be user ng-model
					}).then(function (resp) { //upload function returns a promise
						if (resp.data.error_code === 0) { //validate success
							$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
						} else {
							$window.alert('an error occured');
						}
					}, function (resp) { //catch error
						console.log('Error status: ' + resp.status);
						$window.alert('Error status: ' + resp.status);
					}, function (evt) {
						console.log(evt);
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
						$scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
					});
				};

				$scope.newUserData = {
					email: authService.currentUser(),
					currentPass: "",
					newPass: "",
					newPassRepeat: ""
				}

				$scope.changePass = function () {
					console.log("Submit change password");
					//                console.log($scope.newUserData);
					return $http.post('/changePassword', $scope.newUserData, {
						headers: {
							Authorization: 'Bearer ' + authService.getToken()
						}
					}).success(function (data) {
						authService.saveToken(data.token);
						$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
						});
					}).error(function (err) {
						$scope.err = err;
						console.log(err.message);
					});
				}

				$scope.user = authService.currentUser;
				$scope.updateTheme = function () {
					themeService.layout = $scope.layout;
					console.log("Theme update");
					console.log("Theme:" + themeService.layout);
				};
				$scope.layout = themeService.layout;
				$scope.layouts = themeService.layouts;
	}]);
})();