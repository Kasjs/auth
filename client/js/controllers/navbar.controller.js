(function () {
    'use strict';
    angular.module('rssreader').controller('NavbarController', ['$scope', '$state','$auth','authService', function ($scope, $state, $auth ,authService) {
       $scope.isAuthenticated = function(){
			return $auth.isAuthenticated();	
		} 
        $scope.currentUser = authService.userID();
        $scope.logOut = function () {
            $auth.logout();
            $state.go("home");
        }
        $scope.goHome = function () {
            if ($scope.isAuthenticated()) {
                $state.go("dashboard");
            } else {
                $state.go("home");
            }
        }
    }]);
})();