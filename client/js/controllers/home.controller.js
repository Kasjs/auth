(function () {
    'use strict';
    angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', 'dashboardService', 'feedsService', function ($scope, $state, authService, dashboardService, feedsService) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.currentUser = authService.currentUser;

        $scope.OnFeeds = function () {
            console.log(dashboardService.getViewMode());
            if (authService.isLoggedIn()) {
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