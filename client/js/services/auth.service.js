angular.module('rssreader').factory('authService', ['$http', '$window', function ($http, $window) {
    var auth = {};
    auth.saveToken = function (token) {
        $window.localStorage['rss-reader-token'] = token;
    }

    auth.getToken = function () {
        return $window.localStorage['rss-reader-token'];
    }

    auth.isLoggedIn = function () {
        var token = auth.getToken();
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }
    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.email;
        }
    }
    auth.userID = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload._id;
        }
    }
    auth.register = function (user) {
        return $http.post('/register', user).success(function (data) {
            auth.saveToken(data.token);
        }).error(function (err) {
            console.log(err.message);
        });
    }  
	auth.googleAuth = function (user) {
        return $http.post('/googleAuth', user).success(function (data) {
            auth.saveToken(data.token);
        }).error(function (err) {
            console.log(err.message);
        });
    }
    auth.logIn = function (user) {
		console.log(user);
        return $http.post('/login', user).success(function (data) {
            auth.saveToken(data.token);
        }).error(function (err) {
            console.log(err.message);
        });
    }
    auth.logOut = function () {
        $window.localStorage.removeItem('rss-reader-token');
    }
    return auth;
}]);