angular.module('rssreader').service('articlesService', ['$http', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $q, authService, $timeout, dashboardService, feedsService) {
    var obj = {
        articles: [],
        isFavourites: false
    }
    var articles_num = 50;

    var fetchArticles = function (feed) {
        return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + articles_num + "&q=" + encodeURIComponent(feed.rsslink) + "&method=JSON&callback=JSON_CALLBACK").then(function (response) {
                var recievedFeed = response.data.responseData.feed;
                for (var i = 0; i < recievedFeed.entries.length; i++) {
                    var articleObj = {};
                    var content = document.createElement("content");
                    content.innerHTML = recievedFeed.entries[i].content;
                    var img;
                    if ($(content).find('img')[0] === undefined) {
                        img = "";
                    } else {
                        img = $(content).find('img')[0].src;
                    }
                    articleObj.title = recievedFeed.entries[i].title;
                    articleObj.link = recievedFeed.entries[i].link;
                    articleObj.content = recievedFeed.entries[i].contentSnippet;
                    articleObj.img = img;
                    articleObj.date = recievedFeed.entries[i].publishedDate;
                    obj.articles.push(articleObj);
                }
            },
            function (err) {
                console.log(err);
            });
    }
    obj.checkIfFavourites = function () {
        return obj.isFavourites;
    }
    obj.getAllArticles = function () {
        console.log("all");
        //        return $timeout(function(){
        //            console.log("Resolving");
        //        }, 2000);
        obj.isFavourites = false;
        obj.articles.length = 0;
        dashboardService.setTitle("All");
        dashboardService.resetFeedId();

        angular.forEach(feedsService.feedsDictionary, function (value, key) {
            angular.forEach(value.values, function (value, key) {
                return fetchArticles(value).then(function (res) {
                    console.log("res");
                });
            });
        });
    }

    obj.getArticlesByFeed = function (feed) {
        obj.isFavourites = false;
        obj.articles.length = 0;
        dashboardService.setTitle(feed.title);
        dashboardService.setFeedId(feed._id);
        fetchArticles(feed);
    }

    obj.getArticlesByCat = function (cat) {
        obj.isFavourites = false;
        obj.articles.length = 0;
        dashboardService.setTitle(cat);
        dashboardService.resetFeedId();
        angular.forEach(feedsService.feedsDictionary, function (value, key) {
            if (value.key === cat) {
                angular.forEach(value.values, function (value, key) {
                    fetchArticles(value);
                });
            }
        });
    }

    obj.getFavourites = function () {
        obj.isFavourites = true;
        obj.articles.length = 0;

        dashboardService.setTitle("Favourites");
        dashboardService.resetFeedId();

        console.log(feedsService.favourites);
        angular.copy(feedsService.favourites, obj.articles);
    }
    obj.getFavArticle = function (article) {
        obj.isFavourites = true;

        dashboardService.setTitle("Favourites");
        dashboardService.resetFeedId();

        obj.articles.length = 0;
        obj.articles.push(article);
    }
    obj.addFavourite = function (article) {
        return $http.post('/users/' + authService.userID() + '/addFavArticle', article, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }
    obj.removeFavourite = function (article) {
//        console.log("Removing:");
//        console.log("ArticleId:" + article._id);
        return $http.delete('/users/' + authService.userID() + '/deleteFavFeed/' + article._id, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }
    return obj;
}]);