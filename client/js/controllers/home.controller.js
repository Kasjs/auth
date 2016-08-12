(function () {
    'use strict';
    angular.module('rssreader').controller('HomeController', ['$scope', '$state', '$auth', 'dashboardService', 'feedsService','authService', function ($scope, $state, $auth, dashboardService, feedsService, authService) {
        $scope.isAuthenticated = function(){
			return $auth.isAuthenticated();	
		} 
        $scope.currentUser = authService.userID(); 

        $scope.OnFeeds = function () {
            console.log(dashboardService.getViewMode());
            if ($auth.isAuthenticated()) {
                $state.go('dashboard.' + dashboardService.getViewMode(), {
                    id: authService.userID()
                });
            } else {
                alert('Unauthtorized');
            }
        }
        $scope.OnRegister = function () {
            $state.go('register');
        }
        $scope.OnLogin = function () {
            $state.go('login');
        }
    }]);
})();