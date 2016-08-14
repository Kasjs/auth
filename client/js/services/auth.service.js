angular.module('rssreader').factory('authService', ['$http', '$window','$auth', function ($http, $window, $auth) {
    var auth = {};
    auth.saveToken = function (token) {
        $auth.setToken(token);
    }

    auth.getToken = function () {
        return $auth.getToken();
    }

    auth.isLoggedIn = function () {
        var token = auth.getToken();
        if (token) {
            var payload = $auth.getPayload();
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }
    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = $auth.getPayload();
            return payload.email;
        }
    }
    auth.userID = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = $auth.getPayload();
			console.log(payload);
            return payload.sub;
        }
    }
    auth.register = function (user) {
		console.log(user);
        return $http.post('/register', user).success(function (data) {
			console.log(data);
            auth.saveToken(data.token);
        }).error(function (err) {
            console.log(err.message);
        });
    }  
//	auth.authenticate = function (token) {
//        return $http.post('/auth/google', token).success(function (data) {
//			console.log(data);
//            auth.saveToken(data.token);
//        }).error(function (err) {
//            console.log(err.message);
//        });
//    }
    auth.logIn = function (user) {
		console.log(user);
        return $http.post('/login', user).success(function (data) {
            auth.saveToken(data.token);
        }).error(function (err) {
            console.log(err.message);
        });
    }
    auth.logOut = function () {
		$auth.removeToken();
        $auth.logout();
    }
    return auth;
}]);