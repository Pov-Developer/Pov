var App = angular.module('loop.controllers.home', []);

App.controller('sidebarController', ['$scope', '$state', '$ionicSideMenuDelegate', '$ionicViewSwitcher', '$ionicPlatform', '$cordovaBarcodeScanner', 'Session', function ($scope, $state, $ionicSideMenuDelegate, $ionicViewSwitcher, $ionicPlatform, $cordovaBarcodeScanner, Session) {
	$scope.user = {};

	$scope.searchResults = [
		{
			"name": "Xoggle's Survey",
			"loop": "Xoggle"
		},
		{
			"name": "Eventix's Survey",
			"loop": "Eventix"
		},
		{
			"name": "Kog's Survey",
			"loop": "Kog"
		},
		{
			"name": "Furnitech's Survey",
			"loop": "Furnitech"
		},
		{
			"name": "Kiosk's Survey",
			"loop": "Kiosk"
		},
		{
			"name": "Minga's Survey",
			"loop": "Minga"
		},
		{
			"name": "Xplor's Survey",
			"loop": "Xplor"
		},
		{
			"name": "Aeora's Survey",
			"loop": "Aeora"
		},
		{
			"name": "Pharmacon's Survey",
			"loop": "Pharmacon"
		},
		{
			"name": "Icology's Survey",
			"loop": "Icology"
		}
	];

	$scope.$on('$ionicView.enter', function () {
		$scope.user.firstName = Session.getFirstName();
		$scope.user.lastName = Session.getLastName();
	});

	$scope.signOut = function () {
		Session.destroy();
		$ionicSideMenuDelegate.toggleLeft();
		$ionicViewSwitcher.nextDirection('back');
		$state.go('login');
	};

	$scope.qrScan = function () {
		$ionicPlatform.ready(function () {
			$cordovaBarcodeScanner
				.scan()
				.then(function (result) {
				}, function (error) {
				});
		});
	}
}]);

App.controller('homeController', ['$scope', '$state', 'PopupService', 'Survey', 'SharedSurvey', function ($scope, $state, PopupService, Survey, SharedSurvey) {
	$scope.surveys = [];
	$scope.hasMore = true;

	// Init survey data
	initSurveys();

	$scope.doRefresh = function () {
		if (!Survey.isLoading) {
			Survey.refresh().then(function (res) {
				$scope.surveys = res.data;
				$scope.hasMore = Survey.hasMore;
				$scope.$broadcast('scroll.refreshComplete');
			}).catch(errorAlert);
		}
	};

	$scope.onInfinite = function () {
		$scope.hasMore = Survey.hasMore;
		Survey.next().then(function (res) {
			// Merge arrays
			Array.prototype.push.apply($scope.surveys, res.data);
			$scope.hasMore = Survey.hasMore;
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}).catch(errorAlert);

	};

	function initSurveys(query) {
		$scope.hasMore = true;
		Survey.load(query).then(function (res) {
			$scope.surveys = res.data;
		}).catch(errorAlert);
	}

	$scope.goToSurvey = function (index) {
		if ($scope.surveys[index].questions) {
			SharedSurvey.setSurvey($scope.surveys[index]);
			$state.go("surveyFlow", {surveyId: -1})
		}
		else {
			SharedSurvey.resetSurvey();
			$state.go("surveyFlow", {surveyId: 0})
		}
	};


	$scope.type = [
		{
			name: 'All',
			icon: 'ion-android-funnel'
		},
		{
			name: 'Friends',
			icon: 'ion-android-people'
		},
		{
			name: 'Market',
			icon: 'ion-stats-bars'
		}
	];
	$scope.typeIndex = 0;

	$scope.location = [
		{
			name: 'Global',
			icon: 'ion-earth'
		},
		{
			name: 'Local',
			icon: 'ion-location'
		}
	];
	$scope.locationIndex = 0;

	$scope.popularity = [
		{
			name: 'Hot',
			icon: 'ion-fireball'
		},
		{
			name: 'New',
			icon: 'ion-arrow-up-c'
		}
	];
	$scope.popularityIndex = 0;

	$scope.locationButton = function () {
		switch ($scope.locationIndex) {
			case 0:
			{
				$scope.locationIndex++;
				console.log("Change Global to Local");
				break;
			}
			case 1:
			{
				$scope.locationIndex = 0;
				console.log("Change Local to Global");
				break;
			}
		}
		initSurveys(getQuery());
	};

	$scope.popularityButton = function () {
		switch ($scope.popularityIndex) {
			case 0:
			{
				$scope.popularityIndex++;
				console.log("Change Hot to Newest");
				break;
			}
			case 1:
			{
				$scope.popularityIndex = 0;
				console.log("Change Newest to Hot");
				break;
			}
		}
		initSurveys(getQuery());
	};

	$scope.typeButton = function () {
		switch ($scope.typeIndex) {
			case 0:
			{
				$scope.typeIndex++;
				console.log("Change All to Friends");
				break;
			}
			case 1:
			{
				$scope.typeIndex = 0;
				console.log("Change Friends to Market");
				break;
			}
			case 2:
			{
				$scope.typeIndex = 0;
				console.log("Change Friends to Market");
				break;
			}
		}
		initSurveys(getQuery());
	};

	function getQuery() {
		return {
			type: $scope.type[$scope.typeIndex].name,
			popularity: $scope.popularity[$scope.popularityIndex].name,
			location: $scope.location[$scope.locationIndex].name
		}
	}

	function errorAlert(err) {
		$scope.hasMore = false;
		if (err.status != 401)
			PopupService.alert("genericError");
	}
}]);