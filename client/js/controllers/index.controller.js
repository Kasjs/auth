(function () {
    'use strict';
    angular.module('rssreader').controller('IndexController', ['$scope', '$state', 'authService', '$window', 'themeService', function ($scope, $state, authService, $window, themeService) {
        $scope.layout = themeService.getTheme;
        $scope.text = "some text";
    }]);
})();