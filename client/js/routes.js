angular.module('rssreader', ['ui.router', 'ngValidate', 'ngFileUpload', 'favicon','satellizer'])
    .config(['$stateProvider', '$urlRouterProvider','$authProvider', function ($stateProvider, $urlRouterProvider, $authProvider) {
        $urlRouterProvider.otherwise('home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: './partials/home.html',
                controller: 'HomeController'
            })
            .state('login', {
                url: '/login',
                templateUrl: './partials/auth/login.html',
                controller: 'AuthController',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: './partials/auth/register.html',
                controller: 'AuthController',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('profile', {
                url: '/profile',
                templateUrl: './partials/auth/profile.html',
                controller: 'ProfileController',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (!authService.isLoggedIn()) {
                        authService.logOut();
                        $state.go('home');
                    }
                }]
            })
            .state("dashboard", {
                url: '/dashboard',
                views: {
                    '': {
                        templateUrl: './partials/dashboard/dashboard.html',
                        controller: 'DashboardController'
                    },
                    'sidebar@dashboard': {
                        templateUrl: './partials/dashboard/sidebar.html',
                        controller: 'SidebarController'
                    },
                    'feedHead@dashboard': {
                        templateUrl: './partials/dashboard/feed-head.html',
                        controller: 'DashboardController'
                    }
                },
                resolve: {
                    feedPromise: ['feedsService', function (feedsService) {
                        console.log('resolveFeeds');
                        return feedsService.getAllFeeds();
                   }]
                },
                onEnter: ['articlesService', 'dashboardService', 'feedsService', '$state', 'authService', function (articlesService, dashboardService, feedsService, $state, authService) {
                    console.log("OnEnter");
                    articlesService.getAllArticles();
                }]
            })
            .state("dashboard.list", {
                url: '/list',
                templateUrl: './partials/list/list.html',
                controller: 'ArticlesController'
            })
            .state("dashboard.th-list", {
                url: '/th-list',
                templateUrl: './partials/list/th-list.html',
                controller: 'ArticlesController'
            })
            .state("dashboard.th-large", {
                url: '/th-large',
                templateUrl: './partials/list/th-large.html',
                controller: 'ArticlesController'
            })
            .state("dashboard.addFeed", {
                url: '/add',
                templateUrl: './partials/dashboard/add-feed.html',
                controller: 'FeedsController',
                onEnter: ['dashboardService', function (dashboardService) {
                    dashboardService.setTitle("Add Feed");
                }]
            });
		
		$authProvider.facebook({
			clientId: '174625396282043',
			name: 'facebook',
			url: '/auth/facebook',
			authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
			redirectUri: window.location.origin + '/',
			requiredUrlParams: ['display', 'scope'],
			scope: ['email'],
			scopeDelimiter: ',',
			display: 'popup',
			oauthType: '2.0',
			popupOptions: {
				width: 580,
				height: 400
			}
		});

		// Google
		$authProvider.google({
			clientId: '806677097865-va2i3kq96mmu8i00t9k6q92ks1s9tg0l.apps.googleusercontent.com',
			url: '/auth/google',
			authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
			redirectUri: window.location.origin,
			requiredUrlParams: ['scope'],
			optionalUrlParams: ['display'],
			scope: ['profile', 'email'],
			scopePrefix: 'openid',
			scopeDelimiter: ' ',
			display: 'popup',
			oauthType: '2.0',
			popupOptions: {
				width: 452,
				height: 633
			}
		});
}]);