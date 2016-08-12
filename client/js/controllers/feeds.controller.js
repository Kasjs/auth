(function () {
    'use strict';
    angular.module('rssreader').controller('FeedsController', ['$scope', '$state', '$http', 'feedsService', 'dashboardService', 'articlesService', 'authService', function ($scope, $state, $http, feedsService, dashboardService, articlesService, authService) {
        $scope.obj = {};
        $scope.feeds = feedsService.feedsDictionary;
        $scope.categories = feedsService.CATEGORIES;
        $scope.addFeed = function () {
            $scope.error = '';
            feedsService.addFeed($scope.obj)
                .then(function (res) {
                    $state.reload("dashboard");
                }, function (err) {
                    console.log(err);
                    if (!err.data)
                        $scope.error = err.message;
                    else $scope.error = err.data.message;
                });
        }
    }]);
})();