angular.module('rssreader').factory('authService', ['$http', '$window','$auth', function ($http, $window,$auth) {
    var auth = {};
//    auth.saveToken = function (token) {
//        $window.localStorage['rss-reader-token'] = token;
//    }
//
//    auth.getToken = function () {
//        return $window.localStorage['rss-reader-token'];
//    }
//
//    auth.isLoggedIn = function () {
//        var token = auth.getToken();
//        if (token) {
//            var payload = JSON.parse($window.atob(token.split('.')[1]));
//            return payload.exp > Date.now() / 1000;
//        } else {
//            return false;
//        }
//    }
//    auth.currentUser = function () {
//        if (auth.isLoggedIn()) {
//            var token = auth.getToken();
//            var payload = JSON.parse($window.atob(token.split('.')[1]));
//            return payload.email;
//        }
//    }
    auth.userID = function () {
        if ($auth.isAuthenticated()) {
            var token = $auth.getToken();
            var payload = $auth.getPayload();
			//console.log(payload.userId);
            return payload.userId;
        }
    }
//    auth.register = function (user) {
//        return $http.post('/register', user).success(function (data) {
//            
//        }).error(function (err) {
//            console.log(err.message);
//        });
//    }
//    auth.logIn = function (user) {
//        return $http.post('/login', user).success(function (data) {
//            
//        }).error(function (err) {
//            console.log(err.message);
//        });
//    }
//    auth.logOut = function () {
//        $window.localStorage.removeItem('rss-reader-token');
//    }
    return auth;
}]);