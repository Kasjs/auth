(function () {
    'use strict';
    angular.module('rssreader').controller('AuthController', ['$scope', '$state', '$auth', '$window', 'dashboardService','authService', function ($scope, $state, $auth, $window, dashboardService, authService) {
        $scope.user = {};
        $scope.session;
		$scope.userID = function(){}

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
                $auth.register($scope.user)
                    //$scope.error = error;
        		.then(function (response) {
					 $auth.setToken(response);
          			 $location.path('/home');
//					
//                    $state.go('dashboard.' + dashboardService.getViewMode(), {
//                        id: authService.userID()
//                    });
                });
            }
        };

        $scope.logIn = function (form) {
            if (form.validate()) {
                $auth.login($scope.user)
					.then(function () {
                    if (!$scope.session) {
                        //                    console.log("Not checked");
                        $scope.onExit = function () {
                            $auth.logout();
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
		
		$scope.authenticate = function(provider) {
      		$auth.authenticate(provider)
        		.then(function() {
         	   		console.log('You have successfully signed in with ' + provider + '!');
					$state.go('dashboard.th-large');
          			//$location.path('/home');
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
    //Authorization
    /*
    $scope.auth = auth;
    console.log(auth);
    $scope.logout = function() {
        auth.signout();
        store.remove('profile');
        store.remove('token');
        $location.path('/login');
    }
    */
})();