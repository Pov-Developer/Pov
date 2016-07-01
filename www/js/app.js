angular.module('App',
	[
		'ionic',
		'ngCordova',
		'chart.js',
		'loop.controllers',
		'loop.services',
		'loop.directives',
		'loop.filters'
	])
	.run(initApp)
	.config(initRoutes)
	.config(loadingInterceptor)
	// Inject 401 interceptor
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('sessionInjector');
	})
	.config(function ($ionicConfigProvider, ChartJsProvider) {
		$ionicConfigProvider.navBar.alignTitle('center');
		ChartJsProvider.setOptions({
			colours: ['#FF5252', '#FF8A80'],
			responsive: false
		});
	})
	.constant("constants", {
		"url": "http://45.55.148.67:5000/"
		// "url": "http://localhost:5000/"
	});

function initApp($ionicPlatform, $rootScope, $state, $ionicLoading, AuthService, PopupService) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.disableScroll(true);
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// Set the statusbar to use the default style, tweak this to
			// remove the status bar on iOS or change it to use white instead of dark colors.
			StatusBar.styleDefault();
		}

		// Global variable for platform
		$rootScope.platform = ionic.Platform.platform();
	});

	$rootScope.$on('$stateChangeStart', function (event, toState) {
		// Check if page needs authentication
		if (AuthService.isProtected(toState.name)) {
			if (!AuthService.isAuthenticated()) { // Check if user allowed to transition
				event.preventDefault(); // Prevent migration to default state
				$rootScope.$broadcast('auth.unauthorized');
			}
		}
	});

	$rootScope.$on('loading.show', function () {
		$ionicLoading.show({
			template: '<ion-spinner icon="crescent"></ion-spinner>Loading...'
		});
	});

	$rootScope.$on('loading.hide', function () {
		$ionicLoading.hide()
	});

	$rootScope.$on('auth.unauthorized', function () {
		$state.go('login');
	});

	$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
		if(error.code == 'CONNECTION_ERROR'){
			PopupService.alert('genericError');
		}
	});
}

function initRoutes($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: function () {
				if (ionic.Platform.isAndroid()) {
					return 'views/home/sidebarAndroid.html';
				}
				return 'views/home/sidebarIOS.html';
			},
			controller: 'sidebarController'
		})
		.state('app.home', {
			url: '/home',
			templateUrl: 'views/home/home.html',
			controller: 'homeController'
		})
		.state('app.search', {
			url: '/search',
			templateUrl: 'views/search/search.html'
		})
		.state('app.mySurveys', {
			url: '/mySurveys',
			templateUrl: 'views/survey/mySurveys/mySurveys.html',
			controller: 'mySurveysController'
		})
		.state('editMySurveys', {
			url: '/editMySurveys',
			cache: false,
			templateUrl: 'views/survey/mySurveys/editMySurveys.html',
			controller: 'mySurveysEditController'
		})
		.state('app.surveyStats', {
			url: '/surveyStats',
			templateUrl: 'views/survey/surveyStats/surveyStats.html',
			controller: 'surveyStatsController'
		})
		.state('app.textResults', {
			url: '/textResults',
			templateUrl: 'views/survey/surveyStats/textResults.html',
		})
		.state('app.questionResults', {
			url: '/questionResults',
			templateUrl: 'views/survey/surveyStats/questionResults.html',
		})
		.state('app.loops', {
			url: '/loops',
			templateUrl: 'views/loops/myLoops.html',
			controller: 'myLoopsController',
			resolve: {
				loops: function ($q, Session, RequestService) {
					return RequestService.get('users/' + Session.getId() + '/loops', {}, true)
						.then(function (res) {
							var result = [];
							res.data.forEach(function (item) {
								result.push({
									name: item.Name,
									loopId: item.LoopId,
									checked: false
								})
							});
							return result;
						}).catch(function (err) {
							return $q.reject({code: "CONNECTION_ERROR"});
						});
				}
			}
		})
		.state('app.loopProfile', {
			url: '/loopProfile',
			templateUrl: 'views/loops/loopProfile.html',
			controller: 'loopProfileController'
		})
		.state('app.createLoop', {
			url: '/createLoop',
			templateUrl: 'views/loops/createLoop.html',
			controller: 'createLoopController'
		})
		.state('app.createSurvey', {
			url: '/createSurvey',
			cache: false,
			templateUrl: 'views/survey/createSurvey/createSurvey.html',
			controller: 'createSurveyController',
			resolve: {
				loops: function ($q, Session, RequestService) {
					return RequestService.get('users/' + Session.getId() + '/loops', {}, true)
						.then(function (res) {
							var result = [];
							res.data.forEach(function (item) {
								result.push({
									name: item.Name,
									loopId: item.LoopId,
									checked: false
								})
							});
							return result;
						}).catch(function (err) {
							return $q.reject({code: "CONNECTION_ERROR"});
						});
				},
				attributes: function ($q, RequestService) {
					return RequestService.get('users/attributes', {}, true)
						.then(function (res) {
							var result = [];
							res.data.forEach(function (item) {
								result.push({
									name: item.AttributeName,
									attributeId: item.ProfileAttributeID,
									checked: false,
									required: false
								})
							});
							return result;
						}).catch(function (err) {
							return $q.reject({code: "CONNECTION_ERROR"});
						});
				}
			}
		})
		.state('createSurveyFlow', {
			url: '/createSurveyFlow',
			cache: false,
			templateUrl: 'views/survey/createSurvey/createSurveyFlow.html',
			controller: 'createSurveyFlowController'
		})
		.state('reviewSurvey', {
			url: '/reviewSurvey',
			cache: false,
			templateUrl: 'views/survey/createSurvey/reviewSurvey.html',
			controller: 'reviewSurveyController'
		})
		.state('editSurveyInfo', {
			url: '/editSurveyInfo',
			cache: false,
			templateUrl: 'views/survey/createSurvey/editSurveyInfo.html',
			controller: 'editSurveyInfoController'
		})
		.state('addQuestion', {
			url: '/addQuestion',
			cache: false,
			templateUrl: 'views/survey/createSurvey/addQuestion.html',
			controller: 'addQuestionController'
		})
		.state('editQuestion', {
			url: '/editQuestion/:questionNumber',
			cache: false,
			templateUrl: 'views/survey/createSurvey/editQuestion.html',
			controller: 'editQuestionController'
		})
		.state('surveyFlow', {
			url: '/surveyFlow/:surveyId',
			cache: false,
			templateUrl: 'views/survey/surveyFlow.html',
			controller: 'surveyFlowController',
			resolve: {
				survey: function ($q, $stateParams, RequestService) {
					return RequestService.get('surveys/' + $stateParams.surveyId + '/questions', {}, true)
						.then(function (res) {
							return res.data;
						}).catch(function (err) {
							return $q.reject({code: "CONNECTION_ERROR"});
						});
				}
			}
		})
		.state('app.profile', {
			url: '/profile',
			templateUrl: 'views/profile/profile.html',
			controller: 'profileController'
		})
		.state('app.friends', {
			url: '/friends',
			templateUrl: 'views/friend/friends.html',
			controller: 'friendsController'
		})
		.state('app.addFriend', {
			url: '/addFriend',
			templateUrl: 'views/friend/addFriend.html'
		})
		.state('login', {
			url: '/login',
			cache: false,
			templateUrl: 'views/login/login.html',
			controller: 'loginController'
		})
		.state('signup', {
			url: '/signup',
			cache: false,
			templateUrl: 'views/login/signup.html',
			controller: 'signupController'
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/home');
}

function loadingInterceptor($httpProvider) {
	$httpProvider.interceptors.push(function ($rootScope, $q) {
		var urlsRequested = [];
		return {
			request: function (config) {
				if (config.showLoading) {
					if (urlsRequested.length == 0) {
						$rootScope.$broadcast('loading.show');
					}
					urlsRequested.push(config.url);
				}
				return config
			},
			response: function (res) {
				if (res.config.showLoading) {
					if (urlsRequested.length == 1)
						$rootScope.$broadcast('loading.hide');
					urlsRequested.splice(urlsRequested.indexOf(res.config.url), 1);
				}
				return res
			},
			responseError: function (res) {
				if (res.config.showLoading) {
					if (urlsRequested.length == 1)
						$rootScope.$broadcast('loading.hide');
					urlsRequested.splice(urlsRequested.indexOf(res.config.url), 1);
				}
				return $q.reject(res);
			}
		}
	})
}