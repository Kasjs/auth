angular.module('rssreader').service('feedsService', ['$http', '$state', 'authService', 'dashboardService', function ($http, $state, authService, dashboardService) {
    that = this;
    this.feedsDictionary = [];
    this.favourites = [];
    this.allArticles = [];
    this.CATEGORIES = ["News", "IT", "Sport", "Design", "Movies", "Music", "Culture", "Nature", "Economics", "Science"];
    this.getAllFeeds = function () {
        console.log('feeds');
        return $http.get('/users/' + authService.userID(), {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            angular.copy(res.data, that.feedsDictionary);
            that.getAllFavourites().then(function (res) {
                angular.copy(res.data, that.favourites);
            });
        });
    }
    this.getAllFavourites = function () {
        return $http.get('/users/' + authService.userID() + "/favourites", {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }
    this.addFeed = function (feed) {
        return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + encodeURIComponent(feed.link) + "&method=JSON&callback=JSON_CALLBACK").then(function (response) {
            if (feed.category === undefined) {
                throw new Error("Choose category");
            }
            if (response.data.responseData === null) {
                throw new Error("URL is incorrect or does not contain RSS Feed data");
            }

            //We are receiveng 'recievedFeed' and converting it to suit schema template
            var recievedFeed;
            var feedObj = {};

            recievedFeed = response.data.responseData.feed;
            feedObj.title = recievedFeed.description || recievedFeed.title;
            feedObj.link = recievedFeed.link;
            feedObj.rsslink = feed.link
            feedObj.category = feed.category;

            // console.log("recievedFeed:");
            //            console.log(recievedFeed);
            //            console.log("feedObj:");
            //            console.log(feedObj);
            //            console.log("mediaGroups:");
            //            console.log(recievedFeed.entries[1].mediaGroups);
            return $http.post('/users/' + authService.userID() + '/addFeed', feedObj, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            }).then(function (res) {
            });
        }, function (err) {
            console.log(err);
        });
    }

    this.removeFeed = function (feedId) {
        return $http.delete('/users/' + authService.userID() + '/deleteFeed/' + feedId, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }
}]);