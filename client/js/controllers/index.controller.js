(function () {
    'use strict';
    angular.module('rssreader').controller('IndexController', ['$scope', '$state', '$window', 'themeService', function ($scope, $state, $window, themeService) {
        $scope.layout = themeService.getTheme;
        $scope.text = "some text";
    }]);
})();