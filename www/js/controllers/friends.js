//Controllers for friends page
var App = angular.module('loop.controllers.friends', []);

App.controller('friendsController', ['$scope', 'Friend', function ($scope, Friend) {

	$scope.friends = Friend.getFriends();

	$scope.friendFilters = "";

	$scope.topFriends = Friend.getTopFriends();
}]);
