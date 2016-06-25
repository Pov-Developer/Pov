var App = angular.module('loop.controllers.profile', []);

App.controller('profileController', ['$scope', '$ionicScrollDelegate','Survey', 'Loop', function($scope, $ionicScrollDelegate, Survey, Loop) {

	var sent = null;
	Survey.load().then(function (res) {
		sent = res.data;
		$scope.tabs[0].content = sent;
	});
	$scope.tabs = [{
		title: "Surveys Sent",
		content: []
	}, {
		title: "Surveys Received",
		content: []
	}, {
		title: "Loops Subscribed",
		content: Loop.publicLoops
	}];

	$scope.currentTab = $scope.tabs[0];
}]);