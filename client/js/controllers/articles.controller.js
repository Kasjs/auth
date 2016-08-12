(function () {
    'use strict';
    angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'articlesService', 'dashboardService', function ($scope, $state, articlesService, dashboardService) {
        $scope.articles = articlesService.articles;
        $scope.isFavourites = articlesService.checkIfFavourites;
        $scope.addFavourite = function (article) {
            articlesService.addFavourite(article).then(function (res) {
                $state.reload("dashboard");
                //$state.go("dashboard." + dashboardService.currentView);
            }, function (err) {
                console.log(err.data.message);
            });
        }
        $scope.removeFavourite = function (article) {
            articlesService.removeFavourite(article).then(function (res) {
                $state.reload("dashboard");
                //$state.go("dashboard." + dashboardService.currentView);
            }, function (err) {
                console.log(err);
            });
        }
    }]);
})();
