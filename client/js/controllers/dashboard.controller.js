(function () {
    'use strict';
    angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', 'feedsService', function ($scope, $state, dashboardService, feedsService) {
        if (feedsService.feedsDictionary.length) {
            dashboardService.setTitle("All");
            $state.go('dashboard.' + dashboardService.getViewMode());
        } 
        else {
            dashboardService.setTitle("Add Feed");
            $state.go('dashboard.addFeed');
        }
        

        $scope.headTitle = dashboardService.getTitle;
        $scope.feed = dashboardService.getFeedId;
        $scope.hideViewBtns = function () {
            if ($scope.headTitle() === "Add Feed" || feedsService.feedsDictionary.length == 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.checkIfToggled = function (mode) {
            return dashboardService.getViewMode() === mode;
        }
        $scope.onViewChange = function (view) {
            switch (view) {
                case 'view-mode1':
                    dashboardService.setViewMode(0);
                    break;
                case 'view-mode2':
                    dashboardService.setViewMode(1);
                    break;
                case 'view-mode3':
                    dashboardService.setViewMode(2);
                    break;
            }
            $state.go('dashboard.' + dashboardService.getViewMode());
        }
        $scope.onFeedDelete = function () {
            feedsService.removeFeed(dashboardService.getFeedId())
                .then(function (res) {
                    $state.reload("dashboard");
                    //$state.go("dashboard." + dashboardService.currentView);
                }, function (err) {
                    console.log(err);
                });
        }
    }]);
})();