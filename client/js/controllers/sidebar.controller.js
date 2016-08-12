(function () {
    'use strict';

    angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
        $scope.feeds = feedsService.feedsDictionary;
        $scope.favs = feedsService.favourites;

        $scope.getAll = function () {
            console.log("getAll");
            // if there is only one category and feed, return this feed articles
            if ($scope.feeds.length === 1 && $scope.feeds[0].values.length === 1) {
                $scope.getByFeed($scope.feeds[0].values[0]);
            } else {
                articlesService.getAllArticles();
            }
            $state.go("dashboard." + dashboardService.getViewMode());
        }
        $scope.getByFeed = function (feed) {
            //console.log(feed);
            articlesService.getArticlesByFeed(feed);
            $state.go("dashboard." + dashboardService.getViewMode());
        }
        $scope.getByCat = function (cat, index) {
            // if there is only one feed within selected category, return its articles
            if ($scope.feeds[index].values.length == 1) {
                $scope.getByFeed($scope.feeds[index].values[0]);
            } else {
                articlesService.getArticlesByCat(cat);
            }
            $state.go("dashboard." + dashboardService.getViewMode());
        }
        $scope.getFavourites = function () {
            articlesService.getFavourites();
            $state.go("dashboard." + dashboardService.getViewMode());
        }
        $scope.getFavArticle = function (article) {
            articlesService.getFavArticle(article);
            $state.go("dashboard." + dashboardService.getViewMode());
        }
        $scope.hideFavourites = function () {
            return $scope.favs.length;
        }

        $scope.checkIfEmpty = function () {
            if (feedsService.feedsDictionary.length == 0) {
                return false;
            } else return true;
        }

        $scope.toggle = false;
    }]);
})();